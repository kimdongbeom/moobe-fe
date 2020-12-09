import AdSense from "react-adsense";
import React from "react";

export const EMPTY_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
export const DEFAULT_IMAGE = "https://bulma.io/images/placeholders/96x96.png";

export const GOOGLE_ADSENSE_CLIENT="ca-pub-7725585862762461"
export const GOOGLE_ADSENSE_CONTENT_SOLT="3695466841"
export const GOOGLE_ADSENSE_FAVORITE_SOLT="8756221831"
export const GOOGLE_ADSENSE_COMMENT_SOLT="3691882821"

export const GOOGLE_ANALYTICS_TRACKER_ID="UA-173937062-1"

export const MOOBE_COOKIE_LAST_LOCATION_NAME="MOOBE_LAST_MAP_BOUNDS";
export const MOOBE_COOKIE_USER="mst";

export const isEnableAdSense = () => {
    let enableAd = false;
    if (process.env.REACT_APP_ENABLE_AD && process.env.REACT_APP_ENABLE_AD == "true") {
        enableAd = true
    }
    return enableAd;
}

export const isEnableAnalytics = () => {
    let enableAd = false;
    if (process.env.REACT_APP_ENABLE_ANALYTICS && process.env.REACT_APP_ENABLE_ANALYTICS == "true") {
        enableAd = true
    }
    return enableAd;
}