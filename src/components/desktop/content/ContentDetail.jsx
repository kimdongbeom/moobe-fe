import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faStar} from "@fortawesome/free-solid-svg-icons";
import YouTube from "react-youtube";
import CommentList from "components/common/comment/CommentList";
import {useHistory, useLocation, useParams} from "react-router";
import ScrollManager from "components/common/scroll/ScrollManager";
import {fetchUpdateContentLike, updateContentUpdated} from "data/redux/action/content";
import {faStar as fasStar} from '@fortawesome/free-regular-svg-icons';
import {STORE_LIKED} from "assets/styles/colors";
import {requireUser} from "data/redux/action/user";
import {fetchContentDetail, resetContentDetailData, updateContentDetail} from "data/redux/action/contentDetail";
import {fetchChannel} from "data/redux/action/channel";
import {isNil as _isNil} from "lodash";
import {useLastLocation} from "react-router-last-location";
import YoutubeMetric from "components/common/youtube/Metric";
import {buildChannelPath} from "data/util";

const ContentDetail = () => {

    const {contentDetail} = useSelector(state => state.contentDetail);
    const [liked, setLiked] = useState(contentDetail ? contentDetail.liked : false);

    const dispatch = useDispatch();
    const {channelId, contentId} = useParams();
    const history = useHistory();
    const location = useLocation();
    const lastLocation = useLastLocation();
    const backToContentList = (e) => {
        if (_isNil(lastLocation)) {
            history.push({
                pathname: buildChannelPath({id: channelId}),
                search: location.search
            });
        } else {
            history.goBack(1);
        }
    };

    useEffect(() => {
        dispatch(fetchChannel(channelId));
        dispatch(fetchContentDetail(channelId, contentId));
        return () => {
            dispatch(resetContentDetailData());
        }
    }, [channelId, contentId])

    useEffect(() => {
        setLiked(contentDetail ? contentDetail.liked : false)
    }, [contentDetail]);

    const updateLike = () => {
        let origin = liked;
        let updated = !liked;
        dispatch(requireUser((user) => {
            setLiked(updated);
            dispatch(fetchUpdateContentLike(user.email, contentDetail.id, updated,() => {
                dispatch(updateContentUpdated(contentDetail, {liked: updated}));
                dispatch(updateContentDetail({liked: updated}));
            },() => setLiked(origin)));
        }));
    }

    return (
        <ScrollManager>
            <div className="columns is-block is-paddingless is-fullheight-with-navbar-fixed-height has-padding-right-10 has-padding-left-10 ">
                <div className="columns is-marginless is-bottom-borderless" style={{'lineHeight': '2'}}>
                    <div className="column text-overflow-ellipsis has-padding-right-5">
                        <FontAwesomeIcon className="back-content-detail is-pulled-left has-margin-right-15"
                                         icon={faChevronLeft} size={'2x'} onClick={backToContentList}/>
                        <span><strong>{contentDetail.title}</strong></span>
                    </div>
                    <div className="has-padding-like-column is-left-paddingless is-right-paddingless is-marginless">
                        <FontAwesomeIcon
                            icon={liked ? faStar : fasStar}
                            className="clickable fa-1-25x"
                            color={liked ? STORE_LIKED : ""}
                            onClick={updateLike}/>
                    </div>
                </div>
                <YouTube
                    videoId={contentDetail.videoLinkId}                  // defaults -> null
                    id={contentDetail.videoLinkId}                       // defaults -> null
                    className="youtube-container"                // defaults -> null
                    containerClassName="column is-full is-marginless is-paddingless is-top-borderless has-text-centered"       // defaults -> ''
                    // opts={opts}                        // defaults -> {}
                    // onReady={func}                    // defaults -> noop
                    // onPlay={func}                     // defaults -> noop
                    // onPause={func}                    // defaults -> noop
                    // onEnd={func}                      // defaults -> noop
                    // onError={func}                    // defaults -> noop
                    // onStateChange={func}              // defaults -> noop
                    // onPlaybackRateChange={func}       // defaults -> noop
                    // onPlaybackQualityChange={func}    // defaults -> noop
                />
                <YoutubeMetric content={contentDetail} />
                <CommentList content={contentDetail}/>
            </div>
        </ScrollManager>

    )
};

export default ContentDetail;