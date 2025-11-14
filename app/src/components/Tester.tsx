import { useRef, ChangeEvent } from 'react'
import { handleFile, getAudioContext } from "../processing/Utils.tsx" 
import {loadModel, predict} from "../processing/Prediction.tsx"


export function Tester() {
    const inputRef = useRef<HTMLInputElement | null>(null)

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

    const model: any = loadModel("models/crepe_large") 
    console.log(model)

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