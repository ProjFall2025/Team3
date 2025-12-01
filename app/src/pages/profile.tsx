import axios from 'axios';
import * as EmailValidator from 'email-validator';
import { useState, useEffect, useRef } from 'react';

import { User } from '../types';

import { UserComponent } from '../components/users.tsx';

import { SheetComponent } from '../components/sheet.tsx';

import { Sheet } from '../types';

import { GLOBAL_TAILWIND_THEMES as tw_themes } from '../global.tailwind';

const tw = tw_themes.light;

export default function Update() {
    // These states track validity of username and password and control form flow
    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState("");
    const [validForm, setValidForm] = useState<boolean>(false);
    const [editForm, setEditForm] = useState<boolean>(false);
    const [editUsername, setEditUsername] = useState(0);
    const [editEmail, setEditEmail] = useState(0);
    const [editPassword, setEditPassword] = useState(0);
    const [editBio, setEditBio] = useState(0);
    const [usernameValue, setUsernameValue] = useState<string>("");
    const [emailValue, setEmailValue] = useState<string>("");
    const [passwordValue, setPasswordValue] = useState<string>("");
    const [bioValue, setBioValue] = useState<string>("");
    
    const [showPopup, setShowPopup] = useState(false);
    const [popupValue, setPopupValue] = useState("");
    
    const id = localStorage.getItem("id");
    if(id === null){
        window.location.href = '/'
    }
    console.log(id);

    useEffect(() => {
        const getUser = async() => {
            const response = await axios.get('/api/user/' + id);
            const user = response.data as User;
            setUsernameValue(user.username);
            setEmailValue(user.email);
            setPasswordValue("password");
            setBioValue(user.bio);
    };

        getUser();
    }, [id]);
    

    const usernameIsEdited = async(event) => {
        setEditUsername(1);
        setEditEmail(2);
        setEditPassword(2);
        setEditBio(2);
        setEditForm(true);
    }

    const emailIsEdited = async(event) => {
        setEditEmail(1);
        setEditUsername(2);
        setEditPassword(2);
        setEditBio(2);
        setEditForm(true);
    }

    const passwordIsEdited = async(event) => {
        setEditPassword(1);
        setEditUsername(2);
        setEditEmail(2);
        setEditBio(2);
        setEditForm(true);
    }

    const bioIsEdited = async(event) => {
        setEditBio(1);
        setEditUsername(2);
        setEditEmail(2);
        setEditPassword(2);
        setEditForm(true);
    }

    // Function to validate all fields
    const validate = async (event) =>  {
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        setValidForm(false);

        event.preventDefault();

        const form = event.currentTarget.form;
        setUsernameValue(form.username.value.trim());
        setEmailValue(form.email.value.trim());
        setPasswordValue(form.password.value.trim());
        setBioValue(form.bio.value.trim());

        if(editUsername === 1) {
            const valid = await checkUser(usernameValue);
            setValidForm(valid);
        }

        else if(editEmail === 1) {
            const valid = await checkEmail(emailValue);
            setValidForm(valid);
        }

        else if(editPassword === 1){
            const valid = await checkPassword(passwordValue);
            setValidForm(valid);
        }

        else if(editBio === 1){
            setValidForm(true);
        }     
    }

    const submit = async() => {
        try {
        const response = await axios.post('/api/auth/validate/password', {
            id: id,
            password: popupValue,
        });
        console.log(passwordValue);
        if(response.status === 200){
            console.log(passwordValue);
            const payload: any = {
                username: usernameValue,
                email: emailValue,
                bio: bioValue,
            };

            if (editPassword === 1 && passwordValue !== "password") {
                payload.password = passwordValue;
            }
            else{
                payload.password = popupValue;
            }

            const res = await axios.patch(`/api/user/${id}`, payload);
            console.log("Update status: " + res.status);
        }
        window.location.href = '/profile';
    } catch(error){
        console.log(error.message);
    }
    }

    const cancel = async() => {
        window.location.href = '/profile';
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

    const [sheetsLoaded, setSheetsLoaded] = useState<boolean>(false);
    const sheetDataRef = useRef<Sheet[]>([]);

    useEffect(() => {
        listSheets();
    },);

    async function listSheets()  {
        const userSheets = await axios.get(`/api/user/${id}/sheets`);
            let sheetData: Sheet[] = userSheets.data;
            console.log("User Sheets Data: ", sheetData);
            sheetDataRef.current = sheetData;
            setSheetsLoaded(true);
    }

    function UserHistory() {
        const [visibleCount, setVisibleCount] = useState(5);

        const visibleSheets = sheetDataRef.current.slice(0, visibleCount);

        return (
            <>
                <br />
                <h1 className={tw.header + tw.flexCenter}>My Sheets</h1>
                {/* Render each sheet using the SheetComponent */}
                <div className={tw.gridContainer}>
                {visibleSheets.map((sheet) => (
                    <SheetComponent key={sheet.id} sheet={sheet} />
                ))}
                </div>

                {visibleCount < sheetDataRef.current.length && (
                <div className="flex justify-center mt-4">
                    <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setVisibleCount(visibleCount + 5)}>
                        Show More
                    </button>
                </div>
                )}
            </>
        );
    }

    const [usersLoaded, setUsersLoaded] = useState<boolean>(false);
    const usersDataRef = useRef<User[]>([]);

    useEffect(() => {
        listUsers();
    },);

    async function listUsers()  {
        const users = await axios.get(`/api/user/${id}/following`);
            let usersData: User[] = users.data;
            console.log("User Sheets Data: ", usersData);
            usersDataRef.current = usersData;
            setUsersLoaded(true);
    }

    function UserFollowing() {
        const [visibleCount, setVisibleCount] = useState(5);

        const visibleUsers = usersDataRef.current.slice(0, visibleCount);

        return (
            <>
                <br />
                <h1 className={tw.header + tw.flexCenter}>Following</h1>
                {/* Render each sheet using the SheetComponent */}
                <div className={tw.gridContainer}>
                {visibleUsers.map((user) => (
                    <UserComponent key={user.id} user={user} />
                ))}
                </div>

                {visibleCount < sheetDataRef.current.length && (
                <div className="flex justify-center mt-4">
                    <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setVisibleCount(visibleCount + 5)}>
                        Show More
                    </button>
                </div>
                )}
            </>
        );
    }

    // React Notes: 
    // "hidden disabled" classes are used to hide and disable inputs, buttons, and validation messages as needed
    // A <> tag is a React Fragment used to group multiple elements.
    // A component or part of a statement must return a single element, so we use this fragment to wrap our elements.
    return (
            <>
            <div className={tw.fluidContainer + tw.flexCenter}>
                <h1 className={tw.header}>Profile</h1>
                <form className={tw.form}>
                    <div className="flex space-x-8">
                        <input 
                            type="text" id="username" name="username" 
                            value = {usernameValue}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsernameValue(e.target.value)}
                            className={editUsername === 0 || editUsername === 2 ? tw.inputFieldNotEditable : tw.inputFieldWide}
                        />
                            {editUsername === 0 && <button className={tw.buttonSlim} onClick={usernameIsEdited}>Edit</button> }
                            {editUsername === 1 && <button className={tw.buttonInvisible}>Edit</button> }
                            {editUsername === 2 && <button className={tw.buttonInactive}>Edit</button> }
                    </div>
                    <p className={tw.errorMessage + (usernameError ? "" : "hidden")}>
                        {usernameError}
                    </p>
                    <div className="flex space-x-8">
                        <input
                            type="text" id="email" name="email" 
                            value = {emailValue} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailValue(e.target.value)}
                            className={editEmail === 0 || editEmail === 2 ? tw.inputFieldNotEditable : tw.inputFieldWide}
                        />
                            {editEmail === 0 && <button className={tw.buttonSlim} onClick={emailIsEdited}>Edit</button> }
                            {editEmail === 1 && <button className={tw.buttonInvisible}>Edit</button> }
                            {editEmail === 2 && <button className={tw.buttonInactive}>Edit</button> }
                    </div>
                    <p className={tw.errorMessage + (emailError ? "" : "hidden")}>
                        {emailError}
                    </p>    
                    <div className="flex space-x-8">
                        <input
                            type="password" id="password" name="password" 
                            value = {passwordValue} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordValue(e.target.value)}
                            className={editPassword === 0 || editPassword === 2 ? tw.inputFieldNotEditable : tw.inputFieldWide}
                        />
                            {editPassword === 0 && <button className={tw.buttonSlim} onClick={passwordIsEdited}>Edit</button> }
                            {editPassword === 1 && <button className={tw.buttonInvisible}>Edit</button> }
                            {editPassword === 2 && <button className={tw.buttonInactive}>Edit</button> }
                    </div>
                    <p className={tw.errorMessage + (passwordError ? "" : "hidden")}>
                        {passwordError}
                    </p>
                    <div className="flex space-x-8">
                        <textarea
                            id="bio" name="bio" 
                            value = {bioValue}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBioValue(e.target.value)}
                            className={editBio === 0 || editBio === 2 ? tw.textareaNotEditable : tw.textarea}
                        />
                            {editBio === 0 && <button style={{ marginTop: '20px' }} className={tw.buttonSlim} onClick={bioIsEdited}>Edit</button> }
                            {editBio === 1 && <button style={{ marginTop: '20px' }} className={tw.buttonInvisible}>Edit</button> }
                            {editBio === 2 && <button style={{ marginTop: '20px' }} className={tw.buttonInactive}>Edit</button> }
                    </div>
                    {editForm ? (
                        <div className="flex space-x-8">
                            <button className={tw.buttonMiddle} onClick={validate}>Save</button>
                            <button className={tw.buttonMiddle} onClick={cancel}>Cancel</button>
                            <>
                            {validForm && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                                <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                                <h2 className="text-lg font-semibold mb-4">Enter Current Password</h2>

                                <input
                                    type="password"
                                    onChange={(e) => setPopupValue(e.target.value)}
                                    className="w-full border p-2 rounded mb-6"
                                />

                                <div className="flex justify-center">
                                    <button
                                    className={tw.buttonSlim}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        console.log("Popup value:", popupValue);
                                        setShowPopup(false);
                                        submit();
                                    }}
                                    >
                                    Confirm
                                    </button>
                                </div>
                                </div>
                            </div>
                            )}
                        </>
                        </div>
                    ) : (
                        ""
                    )}
                </form>
            </div>
            <br />
                <hr className="border-2 border-blue-400" />
                <div className={tw.wideContainer + tw.flexCenter}>
                {(sheetsLoaded) && <UserHistory />}
                </div>

                <hr className="border-2 border-blue-400" />
                <div className={tw.wideContainer + tw.flexCenter}>
                {(usersLoaded) && <UserFollowing />}
                </div>
            </>
    );

}