import { useState, useEffect, useRef, forwardRef } from 'react';

import { ClickAwayListener } from './listeners.tsx';

import { GLOBAL_TAILWIND_THEMES as tw_themes } from '../global.tailwind.js';
const tw = tw_themes.light;

export default function Navbar() {
    const mobileMenuOpen = useRef(false);
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const mobileMenuRef = useRef<HTMLDivElement>(null);

    const hamburgerButtonRef = useRef<HTMLButtonElement>(null);

    function HamburgerButton() {
        return (
            <button ref={hamburgerButtonRef} className="hamburger-button md:hidden text-3xl" onClick={() => {
                mobileMenuOpen.current = !mobileMenuOpen.current;
                menuAnimation();
                }}>
                {/* Hamburger icon character */}
                &#9776;
            </button>
        );
    }

    ClickAwayListener(mobileMenuRef, [hamburgerButtonRef], () => {
        if (mobileMenuOpen.current) {
            mobileMenuOpen.current = false;
            menuAnimation();
        }
    });

    const MobileMenu = forwardRef<HTMLDivElement>((props, ref) => {
        return (
                <div ref={ref} className={tw.smoothTransition + " mobile-menu absolute right-0 shadow-[0_0_2rem_black] translate-x-full z-10 opacity-0 md:hidden flex flex-col items-center p-5 gap-8 w-1/3 h-[calc(100%-5rem)] text-2xl bg-[rgba(0,0,0,0.9)] text-white"}>
                    <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</a>
                    <a href="/about" style={{ textDecoration: 'none', color: 'inherit' }}>About</a>
                    <a href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</a>
                </div>
        );
    });

    function menuAnimation() {
        console.log("Mobile menu open state changed to: ", mobileMenuOpen.current);
        if (mobileMenuOpen.current === true) {
            setMobileMenuVisible(true);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setTimeout(() => {
                const menu = document.querySelector('.mobile-menu') as HTMLDivElement | null;
                if (menu) {
                    menu.classList.remove('translate-x-full');
                    menu.classList.remove('opacity-0');
                }
            }, 0);
        } else {
            setTimeout(() => {
                const menu = document.querySelector('.mobile-menu') as HTMLDivElement | null;
                if (menu) {
                    menu.classList.add('translate-x-full');
                    menu.classList.add('opacity-0');
                }
            }, 0);
            timeoutRef.current = setTimeout(() => setMobileMenuVisible(false), 300);
        }
    };

    return (
        <>
        <div className="nav-links justify-between md:justify-center bg-black items-center z-10 h-[5rem]" style={{ display: 'flex', gap: '50px', fontSize: '1.5rem', padding: '10px 10px', color: 'white' }}>
            <div className={"logo"} style={{ fontFamily: '"Notable", sans-serif', fontSize: '2rem', paddingBottom: '8px' }}><a href='/' className={tw.unstyledLink}>KNOWTES</a></div>
            <div className={"links gap-12 hidden md:flex"}>
                <div><a href="/" className={tw.unstyledLink}>Home</a></div>
                <div><a href="/about" className={tw.unstyledLink}>About</a></div>
                <div><a href="/login" className={tw.unstyledLink}>Login</a></div>
            </div>
            <HamburgerButton />
        </div>
        {mobileMenuVisible && (
            <MobileMenu ref={mobileMenuRef} />
        )}
        </>
    );
}