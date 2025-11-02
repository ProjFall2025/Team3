import axios from 'axios';
import { useState, useEffect } from 'react';

import { User } from '../types';

import { GLOBAL_TAILWIND_CLASSES as tw } from '../global.tailwind.classes';

export default function Login() {
    // These states track validity of username and password and control form flow
    const [validUsername, setValidUsername] = useState<boolean>(null);
    const [validPassword, setValidPassword] = useState<boolean>(null);

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

    // React Notes: 
    // "hidden disabled" classes are used to hide and disable inputs, buttons, and validation messages as needed
    // A <> tag is a React Fragment used to group multiple elements.
    // A component or part of a statement must return a single element, so we use this fragment to wrap our elements.
    return (
        <div className="m-4">
            <div className={tw.fluidContainer + tw.flexCenter}>
                {(!validPassword) ?
                <>
                <h1 className={tw.header}>Log In</h1>
                <form className={tw.form}>
                    <input className={tw.inputField + (validUsername ? "hidden disabled" : "")} 
                            type="text" id="username" name="username" 
                            placeholder='Enter username or email' 
                            onKeyDown={(e) => {e.key === 'Enter' && checkUser(e)}} 
                            required />
                    <p className={tw.errorMessage + (validUsername ? "hidden" : "")}>
                        {validUsername === null || validUsername === true ? " " : "Invalid username or email"}
                    </p>
                    <button className={tw.buttonPrimary + (validUsername ? "hidden disabled" : "")} onClick={checkUser}>Next</button>
                    <input className={tw.inputField + (validUsername ? "" : "hidden disabled")} 
                            type="password" id="password" name="password" 
                            placeholder='Enter password' 
                            onKeyDown={(e) => {e.key === 'Enter' && checkPassword(e)}} 
                            required />
                    <p className={tw.errorMessage + (validPassword ? "hidden" : "")}>
                        {validPassword === null || validPassword === true ? " " : "Invalid password"}
                    </p>
                    <button className={tw.buttonPrimary + (validUsername ? "" : "hidden disabled")} onClick={checkPassword}>Log In</button>
                </form>
                </>
                : <h2>Login successful! Redirecting...</h2>
                }
            </div>
        </div>
    );
}