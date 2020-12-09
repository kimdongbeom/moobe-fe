import React, {useContext, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {chunk as _chunk, isEmpty as _isEmpty} from 'lodash';
import {uuid} from "bulma-extensions/bulma-calendar/src/js/utils";
import {LoadingFavorite} from "components/common/layout/PresentUtil";
import {FavoriteContentEmpty, getFavoriteContentWithAdSense} from "components/favorite/Favorite";
import StoreDetailAnimate from "components/mobile/store/StoreDetail";
import {savePosition, ScrollContext, scrollTo} from "components/common/scroll/ScrollManager";
import {useHistory, useLocation} from "react-router";

const Loading = () => (
    <div className="tile is-ancestor is-borderless">
        <div className="card tile is-parent is-borderless is-shadowless">
            <div className="tile is-child box is-shadowless">
                <LoadingFavorite />
            </div>
        </div>
    </div>
)
const MobileFavorite = () => {
    const {favoriteChannelList} = useSelector(state => state.favoriteChannel);
    const {favoriteContentList, favoriteContentLoading} = useSelector(state => state.favoriteContent);
    const [contentDetail, setContentDetail] = useState({});
    const [showDetail, setShowDetail] = useState(false);
    const {scrollTarget, isWindow} = useContext(ScrollContext);
    const [prevScroll, setPrevScroll] = useState(0);
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if (!_isEmpty(location.hash)) {
            history.replace({
                pathname: location.pathname
            });
        }
    }, [])

    useEffect(() => {
        if (_isEmpty(location.hash)) {
            setContentDetail({})
            setTimeout(() => {
                scrollTo(scrollTarget, prevScroll)
            }, 200)
        }
    }, [location])

    const getFavoriteContents = () => {
        return getFavoriteContentWithAdSense(
            favoriteContentList,
            favoriteChannelList,
            5,
            "auto",
            (channel, content) => {
                savePosition(scrollTarget, isWindow, setPrevScroll);
                setContentDetail(content);
                history.push({
                    pathname: location.pathname,
                    hash: "#" + content.id
                })
            });
    }

    const renderFavoriteContents = () => {
        if (_isEmpty(favoriteContentList)) {
            return <FavoriteContentEmpty />
        } else {
            return _chunk(getFavoriteContents(), 1).map(chunkList =>
                <div key={uuid()}>
                    <div className="tile is-ancestor is-borderless is-marginless">
                        {chunkList}
                    </div>
                    <hr className="divider has-background-grey-lighter is-marginless"/>
                </div>
            )
        }
    }

    const resetContentDetail = () => {
        history.goBack(1);
    }
    const callbackShow = () => {
        setShowDetail(true)
    }
    const callbackHide = () => {
        setShowDetail(false)
    }

    return (

            <div className="container">
                <div className="column is-fullheight-with-navbar is-paddingless">
                    <StoreDetailAnimate visible={!_isEmpty(contentDetail)} contentDetail={contentDetail} onClickBack={resetContentDetail} callbackShow={callbackShow} callbackHide={callbackHide}/>
                    {favoriteContentLoading || (!_isEmpty(contentDetail) && showDetail)
                        ? <Loading />
                        : renderFavoriteContents()}
                </div>
            </div>
    )
};

export default MobileFavorite;