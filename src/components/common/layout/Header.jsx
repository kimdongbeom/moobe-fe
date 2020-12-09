import React from 'react';
import {Helmet} from 'react-helmet';

const MoobeHeader = () => {
    return (
        <Helmet>
            <meta charSet="utf-8"/>
            <meta name="viewport"
                  content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            <meta name="theme-color" content="#FFFFFF"/>
            <meta name="background-color" content="#FFFFFF"/>
            <meta name="description" content="Moobe"/>
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
            <link rel="apple-touch-icon" sizes="180x180" href={process.env.PUBLIC_URL + "/logo192_bg.png"}/>
            <link rel="apple-touch-icon_precomposed" sizes="180x180" href={process.env.PUBLIC_URL + "/logo192_bg.png"}/>
            <link rel="icon" type="image/png" href={process.env.PUBLIC_URL + "/logo192_bg.png"} sizes="192x192"/>
            {/*<link rel="apple-touch-icon" href="logo192.png"/>*/}
            {/*  manifest.json provides metadata used when your web app is installed on a*/}
            {/*  user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/*/}
            <link rel="manifest" href={process.env.PUBLIC_URL + "/manifest.json"}/>
            <link rel="shortcut icon" href={process.env.PUBLIC_URL + "/favicon.ico"}/>
            {/*Notice the use of %PUBLIC_URL% in the tags above.*/}
            {/*It will be replaced with the URL of the `public` folder during the build.*/}
            {/*Only files inside the `public` folder can be referenced from the HTML.*/}

            {/*Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will*/}
            {/*work correctly both with client-side routing and a non-root public URL.*/}
            {/*Learn how to configure a non-root public URL by running `npm run build`.*/}
            {/*<script data-ad-client={GOOGLE_ADSENSE_CLIENT} async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>*/}
            <title>{process.env.REACT_APP_WEBSITE_NAME}</title>

        </Helmet>
    )
}

export default MoobeHeader;