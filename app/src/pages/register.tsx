import axios from 'axios';
import * as EmailValidator from 'email-validator';
import { useState, useEffect } from 'react';

import { GLOBAL_TAILWIND_THEMES as tw_themes } from '../global.tailwind';

const tw = tw_themes.light;

export default function Register() {
    // These states track validity of username and password and control form flow
    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState("");
    const [validForm, setValidForm] = useState<boolean>(null);
    
    //let passwordError = "Invalid password";
   
    // Clear any existing session data on component mount (dev purposes)
    useEffect(() => {
        localStorage.removeItem('id');
        localStorage.removeItem('token');
    }, []);

    // Function to validate all fields
    const validate = async (event) =>  {
        setUsernameError("");
        setEmailError("");
        setPasswordError("");

        event.preventDefault();
        const form = event.currentTarget.form;
        const username = form.username.value.trim() as string;
        const password = form.password.value.trim();
        const email = form.email.value.trim() as string;
        const bio = form.bio.value.trim() as string;

        const [userValid, emailValid, passwordValid] = await Promise.all([
            checkUser(username),
            checkEmail(email),
            checkPassword(password),
        ]);

        if (!userValid || !emailValid || !passwordValid) {
            setValidForm(false);
            return;
        }

        setValidForm(true);
        
        try {
            const response = await axios.post('/api/auth/register', {
                username: username,
                email: email,
                password: password,
                bio: bio
            });
            if (!response.data || !response.data.user  || !response.data.token ) {        
                throw new Error("User or token not returned upon registration");
            }
            else {
                localStorage.setItem('id', response.data.user.id.toString());
                localStorage.setItem('token', response.data.token);
                console.log('Registration successful, user id and token stored.');
                // Redirect or perform any other actions upon successful registration
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setValidForm(false);
        }
    }

    // Function to check if username or email exists
    const checkUser = async (username) => {
        try {
            if (username.length === 0){
                setUsernameError("Username is required");
                return false;
            }
            const response = await axios.post('/api/auth/validate/user', {
                username: username,
            });
            if (response.status === 200){
                setUsernameError("Username already exists.");
                return false;
            }
        } catch (error) {
            console.log(error.response.status);
            if (error.response.status === 401) {
                return true;
            }
            else {
                setUsernameError("Error validating username.");
                return false;
            }
        }
    };

    // Function to check email format
    const checkEmail = async (email) => {
        try {
            if (email.length === 0){
                setEmailError("Email is required");
                return false;
            }
            if (EmailValidator.validate(email)) {
                const response = await axios.post('/api/auth/validate/user', {
                    email: email,
                });
                if (response.status === 200){
                    setEmailError("Email already exists.");
                    return false;
                }
            }
            else {
                setEmailError("Invalid email format");
                return false;
            }
        } catch (error) {
            console.log(error.response.status);
            if (error.response.status === 401) {
                return true;
            }
            else {
                setEmailError("Error validating email.");
                return false;
            }
        }
    };


    // Function to validate password for password rules
    // minimum password length = 6, must contain small and capital letter
    const checkPassword = async (password) => {
        const minLength = 6;
        // Check string length
        if (password.length < minLength) {
            setPasswordError("String length must be at least " + minLength + " characters.");
            return false;
        }

        // Check for at least one lowercase letter
        const hasLowercase = /[a-z]/.test(password);
        if (!hasLowercase) {
            setPasswordError("String must contain at least one lowercase letter.");
            return false;
        }

        // Check for at least one uppercase letter
        const hasUppercase = /[A-Z]/.test(password);
        if (!hasUppercase) {
            setPasswordError("String must contain at least one uppercase letter.");
            return false;
        }
        return true;
    };

    // React Notes: 
    // "hidden disabled" classes are used to hide and disable inputs, buttons, and validation messages as needed
    // A <> tag is a React Fragment used to group multiple elements.
    // A component or part of a statement must return a single element, so we use this fragment to wrap our elements.
    return (
            <div className={tw.fluidContainer + tw.flexCenter}>
                {(!validForm) ?
                <>
                <h1 className={tw.header}>Register</h1>
                <form className={tw.form}>
                    <input className={tw.inputField} 
                            type="text" id="username" name="username" 
                            placeholder='Enter username' 
                            required />
                    <p className={tw.errorMessage + (usernameError ? "" : "hidden")}>
                        {usernameError}
                    </p>
                    <input className={tw.inputField} 
                            type="text" id="email" name="email" 
                            placeholder='Enter email' 
                            required />
                    <p className={tw.errorMessage + (emailError ? "" : "hidden")}>
                        {emailError}
                    </p>    
                    <input className={tw.inputField}
                            type="password" id="password" name="password" 
                            placeholder='Enter password' 
                            required />
                    <p className={tw.errorMessage + (passwordError ? "" : "hidden")}>
                        {passwordError}
                    </p>
                    <textarea className={tw.inputField} 
                            id="bio" name="bio" 
                            placeholder='Write something about yourself (optional)' 
                            />
                    <button className={tw.buttonPrimary} onClick={validate}>Register</button>
                </form>
                </>
                : <h2>Registration successful! Please login.</h2>
                }
            </div>
    );
}