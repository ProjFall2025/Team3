import axios from "axios"
import * as tf from "@tensorflow/tfjs";
import * as zip from "@zip.js/zip.js"

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

  // Convert entries into File objects (name must match shard/model.json names)
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

  // Load the model using browserFiles IOHandler (works for both GraphModel and LayersModel saved in TFJS format)
  const model = (await tf.loadGraphModel(tf.io.browserFiles(files as unknown as File[]))) as tf.GraphModel;

  return model;
}

export const predict = async (model: tf.GraphModel, input: tf.Tensor) => {
  const output = model.predict(input);
  return output;
}
