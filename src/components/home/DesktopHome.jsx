import React, {useState} from 'react';
import ContentDetail from "components/desktop/content/ContentDetail";
import DesktopKakaoMap from "components/desktop/map/DesktopKakaoMap";
import DesktopVideoList from "components/desktop/video/DesktopVideoList";
import {Route} from "react-router";
import {contentDetailPagePaths, contentListPagePaths} from "data/router-util";
import DesktopChannelNav from "components/desktop/video/DesktopChannelNav";

const DesktopHome = () => {
    return (
        <div className="columns is-marginless is-paddingless">
            <div className="column is-5 is-4-widescreen is-fullheight-with-navbar has-margin-right-10">
                <ContentWithSidebar />
            </div>
            <div className="column is-paddingless is-fullheight-with-navbar">
                <DesktopKakaoMap />
            </div>
        </div>
    )
};

const ContentWithSidebar = () => {
    const [expandSideBar, setExpandSideBar] = useState(false);
    return (
        <div className="columns box is-paddingless is-fullheight-with-navbar-fixed-height ">
            <div className={"column video-sidebar is-fullheight-with-navbar-fixed-height box is-marginless is-radiusless" + (expandSideBar ? " expanded" : "")}>
                <DesktopChannelNav onClickExpand={(e) => setExpandSideBar(!expandSideBar)} expanded={expandSideBar} />
            </div>
            <div className={"column with-sidebar is-fullheight-with-navbar-fixed-height box is-marginless is-radiusless" + (expandSideBar ? " expanded" : "") }>
                <Route exact path={contentListPagePaths}>
                    <DesktopVideoList />
                </Route>
                <Route exact path={contentDetailPagePaths}>
                    <ContentDetail />
                </Route>
            </div>
        </div>
    )
}

export default DesktopHome;