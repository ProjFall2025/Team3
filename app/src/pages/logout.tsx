import { GLOBAL_TAILWIND_THEMES as tw_themes } from '../global.tailwind';

const tw = tw_themes.light;

export default function Logout() {

    const confirm = async(event) =>{
        event.preventDefault();
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        console.log('Logout successful, token removed.');
        window.location.href = '/';
    }

    const deny = async(event) =>{
        event.preventDefault();
        window.location.href = '/';
    }

    return (
        <div className={tw.fluidContainer + tw.flexCenter}>
            <>
            <h1 className={tw.header}>Do you want to Logout?</h1>
            <form className={tw.form}>
                <div className="flex space-x-8">
                    <button className={tw.buttonMiddle} onClick={confirm}>Yes</button>
                    <button className={tw.buttonMiddle} onClick={deny}>No</button>
                </div>
            </form>
            </>
        </div>
    );
}