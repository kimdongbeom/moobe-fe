import React from 'react';
import {EMPTY_IMAGE} from "assets/styles/const";

const Channel = ({channel}) => {
    return (
        <>
            <div className="media-left">
                <figure className="image"><img
                    className="image has-min-height-32 has-min-width-32 is-32x32 is-rounded"
                    src={channel != null ? channel.profileImg : EMPTY_IMAGE}/>
                </figure>
            </div>
            <div className="media-content align-self-center">
                <p className="subtitle">{channel != null ? channel.youtubeName : ""}</p>
            </div>
        </>

    )
};

export default Channel;