import React, {useCallback, useState} from "react";
import {updateObject} from "data/util";

export const ScrollContext = React.createContext({});

const ScrollManager = props => {
    const [state, setState] = useState({
        scrollTarget: null,
        isWindow: null
    });

    const ref = useCallback((node) => {
        if (node == null) return;
        setState(updateObject(state, {
            scrollTarget: props.isWindow ? window : node.firstChild,
            isWindow: props.isWindow
        }));
    }, []);


    return (
        <div className={props.className} ref={ref}>
            <ScrollContext.Provider value={state}>
                {props.children}
            </ScrollContext.Provider>
        </div>
    )
};

export const savePosition = (scrollTarget, isWindow, setState) => {
    if(scrollTarget) {
        if (isWindow) {
            setState(scrollTarget.scrollY)
        } else {
            setState(scrollTarget.scrollTop)
        }
    }
};

export const scrollTo = (scrollTarget, to) => {
    if(scrollTarget) {
        scrollTarget.scrollTo(0, to);
    }
};

export default ScrollManager;