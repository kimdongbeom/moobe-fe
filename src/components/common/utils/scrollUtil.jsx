import React from 'react';
import {useScroll, useWheel} from "react-use-gesture";


export function callbackOnBottomReached(domRef, reachedCallback, unreachedCallback) {
    const bindWheel = useWheel(state => {
        //state.last mean last wheel event
        console.log("wheel state ", state)
        if (state.last && isScrollBottomReached(domRef)) {
            if (reachedCallback) reachedCallback();
        } else {
            if (unreachedCallback) unreachedCallback();
        }
    }, { domTarget: domRef });
    const bindScroll = useScroll(state => {
        console.log("scroll state ", state)
        if (state.last && isScrollBottomReached(domRef)) {
            if (reachedCallback) reachedCallback();
        } else {
            if (unreachedCallback) unreachedCallback();
        }
    }, { domTarget: domRef });
    console.log("callbackOnBottomReached", domRef)
    if (!domRef.current) return {bindWheel: ()=>{}, bindScroll: ()=>{}};
    return {bindWheel, bindScroll};
}

const isScrollBottomReached = (domRef) => domRef.current.scrollTop + domRef.current.clientHeight >= domRef.current.scrollHeight - 10; // -10 오차.