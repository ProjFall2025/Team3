import { GLOBAL_TAILWIND as gtw } from '../global.tailwind.js';
import { User } from '../types';

const tw = gtw.themes[gtw.current_theme];

export function UserComponent(props: {user: User}) {
    const s = props.user;
    return (
        <div className={tw.fluidContainer}>
            {/* <div className={twd.background + " sheet-content w-1/2 h-1/2 rounded-lg shadow-lg p-5"}> */}
            {/* Sheet content goes here: Song Title, Artist, Description, Instrument, Genre */}
                <h2 className={tw.smallHeader + 'text-blue-900'}>{s.username}</h2>
                <p className={tw.paragraph}>Bio: {s.bio}</p>
                {/* TODO: Include sheet XML preview */}
            {/* </div> */}
        </div>
    );
    
}