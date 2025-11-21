import axios from "axios"
import meyda from "meyda"
import * as tf from "@tensorflow/tfjs";
import * as zip from "@zip.js/zip.js"

import { getAudioContext } from "./Utils";

import { Model } from '../types';

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

  const bufferSize = 1024;
  const hopSize = 512;

  const sampleRate = modelOrSampleRate as number;

  console.log((input as Float32Array), sampleRate);

  const chroma = meyda.extract("chroma", (input as Float32Array).slice(300, 364));

  console.log(chroma);

  return {};
}
