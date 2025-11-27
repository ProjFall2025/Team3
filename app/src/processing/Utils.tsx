import { add } from "@tensorflow/tfjs";

let audioCtx: AudioContext | null = null;
export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const Ctor: any = (window as any).AudioContext || (window as any).webkitAudioContext;
    audioCtx = new Ctor();

    console.log("Initialized audio context!")
  }
  return audioCtx;
}

// Decode ArrayBuffer and convert to mono Float32Array
export const makeMono = async (audio: ArrayBuffer): Promise<{ sampleRate: number; samples: Float32Array }> => {
  const audioCtx: AudioContext = getAudioContext();
  const decoded: AudioBuffer = await audioCtx.decodeAudioData(audio);

  const { numberOfChannels, length, sampleRate } = decoded;
  const mono: Float32Array = new Float32Array(length);

  for (let ch = 0; ch < numberOfChannels; ch++) {
    const channelData: Float32Array = decoded.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      mono[i] = (mono[i] || 0) + channelData[i] / numberOfChannels;
    }
  }
  return { sampleRate, samples: mono };
};

// Generator: sliding window over a Float32Array
export function* slidingWindow(samples: Float32Array, bufferSize: number, hopSize: number) {
  const len = samples.length;
  let start = 0;
  let frameIndex = 0;
  while (start + bufferSize <= len) {
    const frame = samples.subarray(start, start + bufferSize);
    yield { frame, start, end: start + bufferSize, frameIndex };
    start += hopSize;
    frameIndex += 1;
  }
  
  if (start < len) {
    const tail = samples.subarray(start, len);
    const padded = new Float32Array(bufferSize);
    padded.set(tail);
    yield { frame: padded, start, end: len, frameIndex };
  }
}

// Resample a Float32Array from originalSampleRate -> targetSampleRate (linear interpolation)
export function resample(input: Float32Array, originalSampleRate: number, targetSampleRate: number = 16000): Float32Array {
  if (originalSampleRate === targetSampleRate) {
    return input.slice();
  }
  const ratio = targetSampleRate / originalSampleRate;
  const newLength = Math.max(1, Math.round(input.length * ratio));
  const output = new Float32Array(newLength);
  const origLen = input.length;
  const scale = origLen / newLength;
  for (let i = 0; i < newLength; i++) {
    const pos = i * scale;
    const left = Math.floor(pos);
    const right = Math.min(left + 1, origLen - 1);
    const frac = pos - left;
    output[i] = (1 - frac) * input[left] + frac * input[right];
  }
  return output;
}

// Remove noise from a single frame: if RMS < threshold, zero the frame
export function removeNoise(frame: Float32Array, threshold: number = 0.015): Float32Array {
  let sum = 0;
  for (let i = 0; i < frame.length; i++) {
    const v = frame[i];
    sum += v * v;
  }
  const rms = Math.sqrt(sum / frame.length);
  if (rms < threshold) {
    return new Float32Array(frame.length); // zeroed
  }
  return frame.slice();
}

// Main process function:
// - decodes ArrayBuffer to mono once
// - iterates with sliding window generator
// - resamples each frame to targetSampleRate (default 16000 Hz)
// - removes noise per-frame
// - reconstructs output with overlap-add at targetSampleRate
export const process = async (
  file: ArrayBuffer,
  options?: {
    bufferSize?: number; // samples in original sample rate (default 1024)
    hopSize?: number;    // samples hop in original sample rate (default 512)
    targetSampleRate?: number; // default 16000
    threshold?: number;  // noise threshold for removeNoise
  }
): Promise<{ processed: Float32Array; originalSampleRate: number; targetSampleRate: number }> => {
  const bufferSize = options?.bufferSize ?? 1024;
  const hopSize = options?.hopSize ?? 512;
  const targetSampleRate = options?.targetSampleRate ?? 16000;
  const threshold = options?.threshold ?? 0.015;

  const { sampleRate: originalSampleRate, samples } = await makeMono(file);

  // Build frames with generator first to count frames and sizes (so we can preallocate)
  const frames: Array<{ data: Float32Array; resampledLen: number }> = [];
  let frameCount = 0;
  for (const { frame } of slidingWindow(samples, bufferSize, hopSize)) {
    // resample frame
    const resampled = resample(frame, originalSampleRate, targetSampleRate);
    // denoise
    const denoised = removeNoise(resampled, threshold);
    frames.push({ data: denoised, resampledLen: denoised.length });
    frameCount++;
  }

  if (frameCount === 0) {
    return { processed: new Float32Array(0), originalSampleRate, targetSampleRate };
  }

  // compute hop size in resampled domain
  const hopSizeResampled = Math.max(1, Math.round(hopSize * (targetSampleRate / originalSampleRate)));
  const resampledFrameLen = frames[0].resampledLen;
  const outputLen = (frameCount - 1) * hopSizeResampled + resampledFrameLen;
  const output = new Float32Array(outputLen);

  // Overlap-add
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i].data;
    const offset = i * hopSizeResampled;
    for (let j = 0; j < frame.length; j++) {
      const idx = offset + j;
      if (idx >= outputLen) break;
      output[idx] += frame[j];
    }
  }

  return { processed: output, originalSampleRate, targetSampleRate };
};

// TODO: Rename "denoised" to something more descriptive.
export const handleFile = async (file: ArrayBuffer): Promise<{ denoised: Float32Array, sampleRate: number } | undefined> => {
  try {
    const { processed, originalSampleRate, targetSampleRate } = await process(file, {
      bufferSize: 1024,
      hopSize: 512,
      targetSampleRate: 16000
    });
    return { denoised: processed, sampleRate: targetSampleRate };
  } catch (e) {
    console.error("Processing failed: ", e);
    return undefined;
  }
};


// TODO: Use powerSpectrum to detect octave.
// TODO: Find distance between peaks/divide total length by number of notes to determine BPM
export const combNotes = (
  frames: Array<{ chroma: number[]; loudness: any; powerSpectrum: Float32Array, frame: Float32Array }>,
  bufferSize: number,
  hopSize: number,
  sampleRate: number = 16000,
  opts?: { minDurationMs?: number; silenceDeltaDb?: number }
) : Array<{
  pitchClass: number;
  durationFrames: number;
  startTime: number; // seconds
  duration: number; // seconds
  avgLoudness: number;
}> => {
  function addCurrentNote(){
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

  let current = null;

  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const loud: number = loudnessArr[i];
    // Probably a redundant check, given that audio is always preprocessed and denoised.
    const voiced: boolean = Number.isFinite(loud) && loud > silenceThreshold;

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
          addCurrentNote();
        }
      }

    } else {
      if (current !== null) {
        addCurrentNote()
      }
    }
  }

  if (current !== null) {
    addCurrentNote();
  }

  return notes;
};