import { useEffect } from "react";

export function ClickAwayListener(ref: React.RefObject<HTMLElement>, exceptRef: [React.RefObject<HTMLElement> | null], handler: () => void) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node) && !exceptRef.some(exRef => exRef.current && exRef.current.contains(event.target as Node))) {
                handler();
            }
        }
        // Attach the listeners to detect clicks outside the referenced element
        document.addEventListener("mousedown", handleClickOutside);
        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, handler]);
}