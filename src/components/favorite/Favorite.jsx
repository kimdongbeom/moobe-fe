import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {
    fetchFavoriteChannelList,
    fetchFavoriteContentList,
    resetFavoriteChannelData,
    resetFavoriteContentData
} from "data/redux/action/favorite";
import {useMobile} from "components/common/layout/WindowDimensions";
import MobileFavorite from "components/favorite/MobileFavorite";
import DesktopFavorite from "components/favorite/DesktopFavorite";
import ScrollManager from "components/common/scroll/ScrollManager";
import {ViewCountNumber, YoutubeMetricVertical} from "components/common/youtube/Metric";
import Channel from "components/common/youtube/Channels";
import {EMPTY_IMAGE, isEnableAdSense} from "assets/styles/const";
import {_insert, buildContentPath, nullFunction} from "data/util";
import FavoriteContentAdSense from "components/google/FavoriteContentAdSense";
import {find as _find} from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar, faGrinTears} from "@fortawesome/free-regular-svg-icons";

const Favorite = () => {
    const mobile = useMobile();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchFavoriteChannelList());
        dispatch(fetchFavoriteContentList());
        return () => {
            dispatch(resetFavoriteChannelData());
            dispatch(resetFavoriteContentData());
        }
    }, []);

    return (
        <>
            {mobile ? <ScrollManager isWindow><MobileFavorite /></ScrollManager> : <DesktopFavorite />}
        </>
    )
};


export const FavoriteContentEmpty = () => (
    <div className="has-text-centered has-text-grey-light has-text-weight-semibold has-margin-top-50">
        <FontAwesomeIcon className="is-marginless has-text-grey-light has-text-weight-semibold has-margin-top-15"
                         icon={faGrinTears}
                         size={"4x"}/>
        <h1 className="title is-5 has-margin-top-20">
            <p className="has-margin-top-10">즐겨찾기 한 가게들이 없어요...</p>
            <p className="has-margin-top-10">맘에 드는 가게를 즐겨찾 해보세요~! (<FontAwesomeIcon icon={faStar} /> 클릭!)</p>
        </h1>
        <h3 className="title is-5 has-margin-top-15">
            <button className="button is-danger is-md" onClick={(e) => window.location.href='/'}>메인에서 찾기</button>
        </h3>
    </div>
)
export const EmptyFavoriteContent = () => {
    return (
        <div className="card tile is-parent is-borderless is-shadowless">
            <div className="tile is-child box is-shadowless">
                <div className="card-image">
                    <figure className="image youtube-thumbnail-container">
                        <img className="image youtube-thumbnail" src={EMPTY_IMAGE}/>
                    </figure>
                </div>
                <div className="card-content is-left-paddingless is-right-paddingless">

                </div>
            </div>
        </div>
    )
}

export const FavoriteContent = ({channel, content, onClickContent}) => {
    return (
        <div className="card tile is-parent is-borderless is-shadowless is-paddingless-mobile">
            <div className="favorite-video tile is-child box flex-column has-cursor-pointer" onClick={(e) => onClickContent(channel, content)}>
                <div className="flex-grow-1">
                    <div className="card-image">
                        <figure className="image youtube-thumbnail-container">
                            <img className="image youtube-thumbnail" src={content.thumbnailUrl}/>
                        </figure>
                    </div>
                    <div className="card-content is-left-paddingless is-right-paddingless">
                        <div className="media">
                            <div className="media-content">
                                <p className="title is-6 has-margin-bottom-10">{content.title}</p>
                                <small className="">
                                    <ViewCountNumber content={content} />
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <YoutubeMetricVertical content={content} />
                </div>
                <hr className="has-margin-top-5 has-margin-bottom-5 has-background-grey-lighter"/>
                <div className="flex-row">
                    {channel != null? <Channel channel={channel} /> : null}
                </div>

            </div>
        </div>
    )
}

export const getFavoriteContentWithAdSense = (favoriteContentList=[], favoriteChannelList=[], perAdsCount=0, format="auto", onClickContent=nullFunction) => {
    const findChannel = (channelId) => {
        return _find(favoriteChannelList, (channel) => channel.id === channelId);
    }

    let contentList = favoriteContentList.map(favoriteContent => <FavoriteContent key={favoriteContent.content.id} content={favoriteContent.content} channel={findChannel(favoriteContent.channelId)} onClickContent={onClickContent}/>)
    if (!perAdsCount || !isEnableAdSense()) {
        return contentList;
    } else {
        const adCount = Math.floor(contentList.length / perAdsCount)
        for (let i = adCount; i > 0; i--) {
            contentList = _insert(i * perAdsCount, <FavoriteContentAdSense key={`ad-${i * perAdsCount}`} format={format}/>, contentList);
        }
        return contentList
    }
}

export const findChannel = (favoriteChannelList) => (channelId) => {
    return _find(favoriteChannelList, (channel) => channel.id === channelId);
}

export const onClickContent = (history) => (channel, content) => {
    history.push({
        pathname: buildContentPath(channel, content)
    });
}
export default Favorite;