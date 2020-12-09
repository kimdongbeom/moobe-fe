import React, {useState, useEffect} from 'react';
import {isMobile} from "react-device-detect";

export function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

export const isMobileWidth = () => getWindowDimensions().width < 769;

export function initVH() {
    let vh = getWindowDimensions().height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

export function useMobile() {
    const [mobile, setMobile]  = useState(isMobile);
    const dimensions = useWindowDimensions() //for responsive height in mobile web.
    useEffect(() => {
        setTimeout(() => {
            setMobile(isMobile || isMobileWidth());
        }, 500) //delay for dimention detected
    }, [dimensions])

    return mobile;
}

export default function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            let {width, height} = getWindowDimensions();
            setWindowDimensions({width, height});
            initVH();
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}
