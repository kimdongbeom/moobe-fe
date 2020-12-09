import React, {useState} from "react";
import {VideoList} from "components/desktop/video/VideoList";

const DesktopVideoList = () => (
    <div className="columns is-fullheight-with-navbar-fixed-height is-paddingless">
        <div className="column is-full is-marginless is-top-borderless">
            <VideoList />
        </div>
    </div>
);

export default DesktopVideoList;