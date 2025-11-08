import { GLOBAL_TAILWIND as gtw } from '../global.tailwind.js';
import { Sheet } from '../types';

const tw = gtw.themes[gtw.current_theme];

export function SheetComponent(props: {sheet: Sheet}) {
    const s = props.sheet;
    return (
        <div className={tw.fluidContainer}>
            {/* <div className={twd.background + " sheet-content w-1/2 h-1/2 rounded-lg shadow-lg p-5"}> */}
            {/* Sheet content goes here: Song Title, Artist, Description, Instrument, Genre */}
                <h2 className={tw.header + 'text-blue-900'}>{s.title}</h2>
                <p className={tw.paragraph}>Artist: {s.artist}</p>
                <p className={tw.paragraph}>Description: {s.description}</p>
                <p className={tw.paragraph}>Instrument: {s.instrument}</p>
                <p className={tw.paragraph}>Genre: {s.genre}</p>
                {/* TODO: Include sheet XML preview */}
            {/* </div> */}
        </div>
    );
}