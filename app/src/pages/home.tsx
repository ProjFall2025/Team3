import { GLOBAL_TAILWIND_CLASSES as tw } from '../global.tailwind.classes';

import { useEffect, useState } from 'react';

export default function Home() {
    // State to track if the user session is valid
    const [sessionValid, setSessionValid] = useState<boolean>(null);

    // Check if the user session is valid on component mount (page load)
    useEffect(() => {
        localStorage.getItem('token') ? setSessionValid(true) : setSessionValid(false);
    }, []);

    return (
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
    );
}