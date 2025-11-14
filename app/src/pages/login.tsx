import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

import { User } from '../types';

import { GLOBAL_TAILWIND_THEMES as tw_themes } from '../global.tailwind';

const tw = tw_themes.light;
const twd = tw_themes.dark;

export default function Login() {
    // These states track validity of username and password and control form flow
    const [validUsername, setValidUsername] = useState<boolean>(null);
    const [validPassword, setValidPassword] = useState<boolean>(null);

    // Refs for username and password buttons (not currently used but can be useful for future enhancements)
    const usernameButtonRef = useRef<HTMLButtonElement>(null);
    const passwordButtonRef = useRef<HTMLButtonElement>(null);

    // Clear any existing session data on component mount (dev purposes)
    useEffect(() => {
        localStorage.removeItem('id');
        localStorage.removeItem('token');
    }, []);

    // Focus password field when username is validated
    useEffect(() => {
        if (validUsername) {
            const passwordField = document.getElementById('password') as HTMLInputElement | null;
            passwordField?.focus();
        }
    }, [validUsername]);

    // Function to check if username/email exists and is not locked
    const checkUser = async (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const form = event.currentTarget.form;
        const username = form?.username.value as string;
        try {
            let response = null;
            if (username.includes('@')) {
                response = await axios.post('/api/auth/validate/user', {
                    email: username,
                });
            } else {
                response = await axios.post('/api/auth/validate/user', {
                    username: username,
                });
            }
            const user = response.data.user as User;
            if (!user || user.is_locked) {
                console.log('User not found or account is locked');
                setValidUsername(false);
                return;
            }
            setValidUsername(true);
            localStorage.setItem('id', user.id.toString());
        } catch (error) {
            console.error('Error validating user:', error);
            setValidUsername(false);
        }
    };

    // Function to validate password for the given user ID
    const checkPassword = async (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const form = event.currentTarget.form;
        const password = form?.password.value;
        const userID = localStorage.getItem('id');

        try {
            const response = await axios.post('/api/auth/validate/password', {
                id: userID,
                password: password,
            });
            if (!response.data || !response.data.token) {
                console.log('Invalid password');
                setValidPassword(false);
                return;
            }
            localStorage.setItem('token', response.data.token);
            console.log('Login successful, token stored.');
            setValidPassword(true);
            // Redirect or perform any other actions upon successful login
            window.location.href = '/';
        } catch (error) {
            console.error('Error validating password:', error);
            setValidPassword(false);
        }
    };

    function OrElement() {
        return (<div className={`flex items-center w-full max-w-md ${validUsername ? "hidden disabled" : ""}`}>
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-2 text-gray-500">or</span>
            <hr className="flex-grow border-t border-gray-300" />
        </div>
        );
    }

    function GoogleButton() {
        // In accordance with Google's branding guidelines: https://developers.google.com/identity/branding-guidelines
        function GoogleSVG() {
            return (
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block", width: "24px", height: "24px"}}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                </svg>
            );
        }
        return (<button className={tw.button.secondary + "flex justify-center gap-[10px] " + (validUsername ? "hidden disabled" : "")} 
                        onClick={(e) => { e.preventDefault(); alert("Google login not implemented yet."); }}>
            {/* Google icon can be added here */}
            <GoogleSVG />
            <span className="w-full">Log in with Google</span>
        </button>
        );
    }

    function FacebookButton() {
        return (<button className={tw.button.secondary + (validUsername ? "hidden disabled" : "")} onClick={(e) => { e.preventDefault(); alert("Facebook login not implemented yet."); }}>
            Log in with Facebook
        </button>
        );
    }

    // React Notes: 
    // "hidden disabled" classes are used to hide and disable inputs, buttons, and validation messages as needed
    // A <> tag is a React Fragment used to group multiple elements.
    // A component or part of a statement must return a single element, so we use this fragment to wrap our elements.
    return (
        <div className={tw.fluidContainer + tw.flexCenter}>
            {(!validPassword) ?
            <>
            <h1 className={tw.header}>Log In</h1>
            <form className={tw.form}>
                <input className={tw.inputField + (validUsername ? "hidden disabled" : "")} 
                        type="text" id="username" name="username" 
                        placeholder='Enter username or email' 
                        onKeyDown={(e) => {
                            e.key === 'Enter' && checkUser(e)
                            const clonedEvent = { ...e };
                            setTimeout((e) => {
                                e.currentTarget.value !== '' ? usernameButtonRef.current?.classList.remove(...tw.button.inactive.split(' ')) : usernameButtonRef.current?.classList.add(...tw.button.inactive.split(' '));
                            }, 0, clonedEvent as React.KeyboardEvent<HTMLInputElement>);
                        }}
                        required />
                <p className={tw.errorMessage + (validUsername ? "hidden" : "")}>
                    {validUsername === null || validUsername === true ? " " : "Invalid username or email"}
                </p>
                <button ref={usernameButtonRef} className={tw.button.primary + (validUsername ? "hidden disabled" : "") + tw.button.inactive} onClick={checkUser}>Next</button>
                <OrElement />
                <GoogleButton />
                <input className={tw.inputField + (validUsername ? "" : "hidden disabled")} 
                        type="password" id="password" name="password" 
                        placeholder='Enter password' 
                        onKeyDown={(e) => {
                            e.key === 'Enter' && checkPassword(e);
                            const clonedEvent = { ...e };
                            setTimeout((e) => {
                                e.currentTarget.value !== '' ? passwordButtonRef.current?.classList.remove(...tw.button.inactive.split(' ')) : passwordButtonRef.current?.classList.add(...tw.button.inactive.split(' '));
                            }, 0, clonedEvent as React.KeyboardEvent<HTMLInputElement>);
                        }} 
                        required />
                <p className={tw.errorMessage + (validPassword ? "hidden" : "")}>
                    {validPassword === null || validPassword === true ? " " : "Invalid password"}
                </p>
                <button ref={passwordButtonRef} className={tw.button.primary + (validUsername ? "" : "hidden disabled ") + tw.button.inactive} onClick={checkPassword}>Log In</button>
            </form>
            </>
            : <h2>Login successful! Redirecting...</h2>
            }
        </div>
    );
}