import { GLOBAL_TAILWIND_THEMES as tw_themes } from '../global.tailwind.js';

import { useEffect, useState, useRef } from 'react';

import { SheetComponent } from '../components/sheet.tsx';

import { Sheet } from '../types';

import axios from 'axios';

const tw = tw_themes.light;
const twd = tw_themes.dark;

export default function Home() {
    // State to track if the user session is valid
    const [sessionValid, setSessionValid] = useState<boolean>(null);

    // Check if the user session is valid on component mount (page load)
    useEffect(() => {
        localStorage.getItem('token') ? setSessionValid(true) : setSessionValid(false);
        getTopTenSheetsDataByAverage();
    }, []);

    // State to track if sheets data has been loaded
    const [sheetsLoaded, setSheetsLoaded] = useState<boolean>(false);
    const sheetDataRef = useRef<Sheet[]>([]);

    // fetch function
    async function getTopTenSheetsDataByAverage() {
        // Get top 10 sheets (stub data for now)
        const topSheets = await axios.get('/api/sheet/topten/averages');
        let sheetData: Sheet[] = topSheets.data;
        console.log("Top Sheets Data: ", sheetData);
        sheetDataRef.current = sheetData;
        setSheetsLoaded(true);
    }

    function TopTenSheets() {
        return (
            <>
                <br />
                <h1 className={tw.header + tw.flexCenter}>Top 10 Sheets</h1>
                {/* Render each sheet using the SheetComponent */}
                {sheetDataRef.current.map((sheet) => (
                    <SheetComponent
                        sheet={sheet}
                    />
                ))}
            </>
        );
    }

    return (
        <>
            <div className={tw.fluidContainer + tw.flexCenter}>
                <h1 className={tw.header}>Home Page</h1>
                {sessionValid === null ? (
                    <p>Loading...</p>
                ) : sessionValid ? (
                    <p>Welcome, you are logged in!</p>
                ) : (
                    <p>You are a guest. Log in to access more features.</p>
                )}
            </div>
            {(sessionValid && sheetsLoaded) &&
            <TopTenSheets />}
        </>
    );
}