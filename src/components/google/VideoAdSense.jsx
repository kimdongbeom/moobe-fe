import React, {useEffect} from 'react';
import AdSense from "react-adsense";
import {GOOGLE_ADSENSE_CLIENT, GOOGLE_ADSENSE_CONTENT_SOLT} from "assets/styles/const";

const VideoAdSense = () => {
    return (
        <div className="video media has-cursor-pointer has-text-centered is-marginless">
            <AdSense.Google
                style={{width: "100%", maxHeight:"150px", display:"block"}}
                client={GOOGLE_ADSENSE_CLIENT}
                slot={GOOGLE_ADSENSE_CONTENT_SOLT}
                format="horizontal"
                responsive="true"
            />
            {/*<ins className="adsbygoogle"*/}
            {/*     style={{minWidth:"150px", width: "100%", maxHeight:"150px"}}*/}
            {/*     data-ad-client="ca-pub-2932083547123665"*/}
            {/*     data-ad-slot="3695466841"*/}
            {/*     data-ad-format="rectangle, horizontal"*/}
            {/*     data-full-width-responsive="true"></ins>*/}
        </div>
    )
}

export default React.memo(VideoAdSense);