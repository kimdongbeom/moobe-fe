import React from 'react';
import {GOOGLE_ADSENSE_CLIENT, GOOGLE_ADSENSE_FAVORITE_SOLT} from "assets/styles/const";
import AdSense from "react-adsense";

const FavoriteContentAdSense = ({format}) => {
    return (
        <div className="card tile is-parent is-borderless is-shadowless is-paddingless-mobile has-min-height-150-mobile">
            <div className="favorite-video tile is-child box flex-column has-cursor-pointer">
                <AdSense.Google
                    style={{width: "100%", height:"100%"}}
                    client={GOOGLE_ADSENSE_CLIENT}
                    slot={GOOGLE_ADSENSE_FAVORITE_SOLT}
                    format={format}
                />
            </div>
        </div>
    )
}

export default React.memo(FavoriteContentAdSense);