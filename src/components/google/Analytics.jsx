import React, { useEffect } from "react";
import ReactGA from "react-ga";
import {GOOGLE_ANALYTICS_TRACKER_ID, isEnableAnalytics} from "assets/styles/const";
import {useLocation} from "react-router";

if (isEnableAnalytics()) {
    ReactGA.initialize(GOOGLE_ANALYTICS_TRACKER_ID);
}

const withGA = (BaseComponent, options = {}) => {

    const trackPage = page => {
        ReactGA.set({
            page,
            ...options
        });
        ReactGA.pageview(page);
    };

    return (props) => {
        const location = useLocation();

        useEffect(() => {
            trackPage(location.pathname + location.search)
        }, [location.pathname, location.search]);

        return <BaseComponent {...props} />;
    };
};

export default isEnableAnalytics() ? withGA : (BaseComponent) => (props) => <BaseComponent {...props} />;
