import { useEffect, useState } from "react";

export const useScroll = () => {
    const [status, setStatus] = useState(0);
    const onScroll = () => {
        setStatus(window.scrollY);
    };
    useEffect(() => {
        window.addEventListener("scroll", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    })
    return status;
};