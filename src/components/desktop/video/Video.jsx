import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router";
import {buildChannelPath, buildContentPath, buildQuery} from "data/util";
import {toString as _toString} from 'lodash';
import {fetchUpdateContentLike, SEARCH_TYPE_TAG, updateContentUpdated} from "data/redux/action/content";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {faStar as fasStar} from "@fortawesome/free-regular-svg-icons";
import {STORE_LIKED} from "assets/styles/colors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {requireUser} from "data/redux/action/user";
import Moment from "react-moment";
import Numbers from "components/common/youtube/Numbers";
import {setFocusedLocation} from "data/redux/action/location";
import MapLocation from "data/redux/model/MapLocation";
import {EMPTY_IMAGE} from "assets/styles/const";

const Video = ({channel=null, content}) => {
    const [textEllipsis, setTextEllipsis] = useState(true);
    const {activeChannel} = useSelector(state => state.channel);
    const [liked, setLiked] = useState(content.liked);
    const {changedMapBounds} = useSelector(state => state.map);
    const {contentId} = useParams();
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        setLiked(content.liked)
    }, [content])

    const updateActiveContent = (content) => {
        if (contentId !== _toString(content.id)) {
            history.push({
                pathname: buildContentPath(activeChannel, content),
                search: location.search
            });
        }
    };

    const updateLike = (e) => {
        let origin = liked;
        let updated = !liked;
        dispatch(requireUser((user) => {
            setLiked(updated);
            dispatch(fetchUpdateContentLike(user.email, content.id, updated,() => {
                dispatch(updateContentUpdated(content, {liked: updated}));
            },() => setLiked(origin)));
        }));
        e.stopPropagation();
    }

    const updateFocusedLocation = (content) => {
        dispatch(setFocusedLocation(new MapLocation(content)));
    };

    const searchTag = (e, tag) => {
        history.push({
            pathname: buildChannelPath(activeChannel),
            search: buildQuery({
                query: tag,
                searchType: SEARCH_TYPE_TAG,
                page: 1,
                swLat: changedMapBounds.sw.lat,
                swLng: changedMapBounds.sw.lng,
                neLat: changedMapBounds.ne.lat,
                neLng: changedMapBounds.ne.lng
            })
        });
        e.stopPropagation();
    }

    return (
        <div className={"video media has-cursor-pointer has-padding-top-10 has-padding-bottom-10 has-padding-right-15 has-padding-left-15 is-marginless"}
             onClick={(e) => updateActiveContent(content)}
             onMouseEnter={() => {updateFocusedLocation(content); setTextEllipsis(false)}}
             onMouseLeave={() => {updateFocusedLocation(null); setTextEllipsis(true)}}>
            <figure className="media-left has-margin-right-10">
                <p className="image is-155x88 youtube-thumbnail-container has-border-radius-6 has-margin-top-5">
                    <img className="image youtube-thumbnail" src={content.thumbnailUrl} />
                </p>
            </figure>
            <div className="media-content overflow-hidden">
                <div className="content">
                    <FontAwesomeIcon
                        icon={liked ? faStar : fasStar}
                        className="video-like-btn clickable"
                        color={liked ? STORE_LIKED : ""}
                        size={'1x'}
                        onClick={updateLike} />
                    <p className={"is-marginless has-margin-bottom-5" + (textEllipsis ? " text-overflow-ellipsis" : "")}>
                        <strong>{content.title}</strong>
                    </p>
                    <p className="has-text-left is-marginless">
                        {content.tagList.map(tag => {
                            return <span key={tag} className="fa-0-87x has-text-link clickable" onClick={(e) => searchTag(e, tag)}>#{tag}</span>
                        })}
                    </p>
                    <p className="has-text-left is-marginless has-text-grey-light">
                        <small className="has-text-weight-semibold">
                            <span className="video-view-count">
                                <Numbers prefix="조회수 " postfix="회" shorten={true} shortenPrecision={1} shortFormatMinValue={1000}>{content.viewCount}</Numbers>
                            </span>
                            <span className="video-date">
                                {content.registerDate ? (<Moment fromNow>{content.registerDate}</Moment>) : "알수 없음"}
                            </span>
                        </small>
                    </p>
                    <div className="is-flex justify-flex-end">
                        <div className="is-flex">
                            <div className="media-left has-margin-right-10">
                                <figure className="image is-24x24 is-marginless">
                                    {channel != null
                                        ? <img className="image is-rounded" src={channel.profileImg}/>
                                        :<img className="image has-min-height-24 is-rounded" src={EMPTY_IMAGE}/> }
                                </figure>
                            </div>
                            <div className="media-content align-self-center">
                                <p className="">
                                    {channel != null ? channel.youtubeName : "전체 채널"}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};
export default Video;