import axios from "axios"
import meyda from "meyda"
import * as tf from "@tensorflow/tfjs";
import * as zip from "@zip.js/zip.js"

import { getAudioContext, slidingWindow } from "./Utils.tsx";

import { Model } from '../types';


function combNotes(
  frames: Array<{ chroma: number[]; loudness: any; frame: Float32Array }>,
  bufferSize: number,
  hopSize: number,
  sampleRate: number = 16000,
  opts?: { minDurationMs?: number; silenceDeltaDb?: number }
) : Array<{
  pitchClass: number;
  startFrame: number;
  durationFrames: number;
  startTime: number; // seconds
  duration: number; // seconds
  avgLoudness: number;
}> {
  const minDurationMs: number = opts?.minDurationMs ?? 30; // ignore events shorter than this
  const silenceDeltaDb: number = opts?.silenceDeltaDb ?? 30; // how far below peak counts as silence (dB)

  const loudnessArr: Array<number> = frames.map(f => {return f.loudness.total;});

  const peakLoudness: number = Math.max(...loudnessArr.filter(v => Number.isFinite(v)));
  const silenceThreshold: number = peakLoudness - silenceDeltaDb;

  // console.log(`loudness arr: ${loudnessArr}`);
  console.log(`peak loudness: ${peakLoudness}`);
  console.log(`silence delta: ${silenceDeltaDb}`);
  console.log(`silence threshold: ${silenceThreshold}`);

  const notes: Array<{
    pitchClass: number;
    startFrame: number;
    durationFrames: number;
    startTime: number;
    duration: number;
    avgLoudness: number;
  }> = [];

  let current = null as null | {
    pitchClass: number;
    startFrame: number;
    durationFrames: number;
    loudnessSum: number;
    loudnessCount: number;
  };

  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const loud: number = loudnessArr[i];
    const voiced: boolean = Number.isFinite(loud) && loud > silenceThreshold;

    // determine pitch class from chroma (0-11). If chroma missing, mark unvoiced.
    let pitchClass: number = -1;

    // choose max chroma entry
    let maxIdx: number = 0;
    let maxVal: number = f.chroma[0];
    for (let j = 1; j < f.chroma.length; j++) {
      if (f.chroma[j] > maxVal) { maxVal = f.chroma[j]; maxIdx = j; }
    }

    // only accept pitch if chroma energy significant relative to sum
    const sumChroma = f.chroma.reduce((a, b) => a + Math.abs(b), 0) || 1e-12;
    if (maxVal / sumChroma > 0.15) {
      pitchClass = maxIdx;
    } else {
      // weak tonal content => treat as unvoiced
      pitchClass = -1;
    }
  
    if (voiced && pitchClass >= 0) {
      if (current === null) {
        // start new note
        current = {
          pitchClass,
          startFrame: i,
          durationFrames: 1,
          loudnessSum: loud,
          loudnessCount: 1
        };
      } else {
        // continue if same pitch; otherwise end and start new
        if (pitchClass === current.pitchClass) {
          current.durationFrames++;
          current.loudnessSum += loud;
          current.loudnessCount++;
        } else {
          const duration = (current.durationFrames * hopSize) / sampleRate;
          const startTime = (current.startFrame * hopSize) / sampleRate;
          if (duration * 1000 >= minDurationMs) {
            notes.push({
              pitchClass: current.pitchClass,
              startFrame: current.startFrame,
              durationFrames: current.durationFrames,
              startTime,
              duration,
              avgLoudness: current.loudnessSum / current.loudnessCount
            });
          }
          current = {
            pitchClass,
            startFrame: i,
            durationFrames: 1,
            loudnessSum: loud,
            loudnessCount: 1
          };
        }
      }
    } else {
      if (current !== null) {
        const duration = (current.durationFrames * hopSize) / sampleRate;
        const startTime = (current.startFrame * hopSize) / sampleRate;
        if (duration * 1000 >= minDurationMs) {
          notes.push({
            pitchClass: current.pitchClass,
            startFrame: current.startFrame,
            durationFrames: current.durationFrames,
            startTime,
            duration,
            avgLoudness: current.loudnessSum / current.loudnessCount
          });
        }
        current = null;
      }
    }
  }

  if (current !== null) {
    const duration = (current.durationFrames * hopSize) / sampleRate;
    const startTime = (current.startFrame * hopSize) / sampleRate;
    if (duration * 1000 >= minDurationMs) {
      notes.push({
        pitchClass: current.pitchClass,
        startFrame: current.startFrame,
        durationFrames: current.durationFrames,
        startTime,
        duration,
        avgLoudness: current.loudnessSum / current.loudnessCount
      });
    }
  }

  return notes;
}


export const loadModel = async (filepath: string): Promise<tf.GraphModel> => {
  const response = await axios.post("/api/model/load", {
   data: { filepath: filepath }
  });

  const modelPayload = response.data?.model;
  if (!modelPayload || !modelPayload.data) {
    throw new Error("No model received from server");
  }

  // Convert server Buffer-like JSON to Uint8Array
  // Server sends { type: 'Buffer', data: [byte, ...] }
  const zipped = new Uint8Array(modelPayload.data);

  // Use zip.js to read the zip from the Uint8Array
  const reader = new zip.ZipReader(new zip.Uint8ArrayReader(zipped));
  const entries = await reader.getEntries();
  console.log(entries);

  // Convert entries into File objects
  const files: File[] = [];
  for (const entry of entries) {
    if (entry.directory) continue;
    // getData with BlobWriter to get a Blob for each entry
    const blob = await (entry as any).getData(new zip.BlobWriter());
    const file = new File([blob], entry.filename, { type: "application/octet-stream" });
    files.push(file);
  }

  await reader.close();
  
  // Ensure model.json is first in the list
  files.sort((a, b) => (a.name === "model.json" ? -1 : b.name === "model.json" ? 1 : 0));
  console.log(files);
  

  await tf.ready();
  // Load the model using browserFiles IOHandler 
  // TODO: Find proper graph model, not one that is broken.
  const model = (await tf.loadGraphModel(tf.io.browserFiles(files))) as tf.GraphModel;
  console.log(model);

  return model;
}

export async function predict(input: tf.Tensor, model: tf.GraphModel): Promise<tf.Tensor | tf.Tensor[] | tf.NamedTensorMap>;
export async function predict(audio: Float32Array, sampleRate: number): Promise<void>;

export async function predict(
  input: tf.Tensor | Float32Array,
  modelOrSampleRate: tf.GraphModel | number
): Promise<tf.Tensor | tf.Tensor[] | tf.NamedTensorMap | void> {
  if (typeof (modelOrSampleRate as any).predict === "function") {
    const model = modelOrSampleRate as tf.GraphModel;
    return { prediction: model.predict(input as tf.Tensor) as tf.Tensor };
  }

  const bufferSize: number = 512;
  const hopSize: number = 512;

  const sampleRate: number = modelOrSampleRate as number;

  let notes = [];

  for (const { frame } of slidingWindow((input as Float32Array), bufferSize, hopSize)){
    const chroma = meyda.extract(["chroma", "loudness"], frame);
    notes.push(chroma)
  }

  console.log(notes);
  notes = combNotes(notes, bufferSize, hopSize, sampleRate, {minDurationMs: 50, silenceDeltaDb: 30})
  console.log(notes);

  return {};
}
