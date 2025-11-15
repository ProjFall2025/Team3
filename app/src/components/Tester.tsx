import { useRef, ChangeEvent, useEffect, useState } from 'react'
import { handleFile, getAudioContext } from "../processing/Utils.tsx" 
import {loadModel, predict} from "../processing/Prediction.tsx"

import * as tf from "@tensorflow/tfjs"


export function Tester() {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [model, setModel] = useState<tf.GraphModel | null>(null)
    const [loadingModel, setLoadingModel] = useState(false)

    useEffect(() => {
        (async () => {
            try {
                setLoadingModel(true)
                const m = await loadModel("models/crepe_large")
                await tf.ready()
                setModel(m)
                console.log("Model loaded", m)
            } catch (err) {
                console.error("Failed to load model:", err)
            } finally {
                setLoadingModel(false)
            }
        })()
    }, [])

    const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = async () => {
            const result: ArrayBuffer = reader.result as ArrayBuffer;

            const { denoised, sampleRate } = await handleFile(result);
            console.log(`Number samples:, ${denoised.length}, sampleRate:, ${sampleRate}`)
            
            const audioCtx = getAudioContext();

            const buffer = audioCtx.createBuffer(1, denoised.length, sampleRate);
            buffer.copyToChannel(denoised, 0, 0);
            
            const src = audioCtx.createBufferSource();
            src.buffer = buffer;
            src.connect(audioCtx.destination);
            src.start();
        }
        reader.readAsArrayBuffer(file)
    }

    return (
        <div>
            <input
                ref={inputRef}
                type="file"   
                accept="audio/*"
                onChange={onFileChange}
            />
        </div>
    )
}