import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {faStar} from "@fortawesome/free-solid-svg-icons";
import {faStar as fasStar} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useHistory, useParams} from "react-router";
import {buildChannelPath, buildQuery} from "data/util";
import {STORE_LIKED} from "assets/styles/colors";
import {requireUser} from "data/redux/action/user";
import {fetchUpdateContentLike, SEARCH_TYPE_TAG, updateContentUpdated} from "data/redux/action/content";
import Numbers from "components/common/youtube/Numbers";
import Moment from "react-moment";
import {setFocusedLocation} from "data/redux/action/location";
import MapLocation from "data/redux/model/MapLocation";
import {EMPTY_IMAGE} from "assets/styles/const";

const Store = ({channel, content}) => {
    const {activeChannel} = useSelector(state => state.channel);
    const [liked, setLiked] = useState(content.liked);
    const {contentId} = useParams();
    const {changedMapBounds} = useSelector(state => state.map);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        setLiked(content.liked)
    }, [content])

    const updateActiveContent = (content) => {
        dispatch(setFocusedLocation(new MapLocation(content)));
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

    const searchTag = (e, tag) => {
        if (!confirm("태그: " + tag + "(으)로 검색하시겠습니까?")) {
            e.stopPropagation()
            return ;
        }
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
        <>
            <div className="video media has-padding-top-10 has-padding-bottom-10 is-marginless ">
                <figure className="media-left" onClick={() => updateActiveContent(content)}>
                    <div className="image is-120x68 has-margin-top-5">
                        <div style={{background: `url(${content.thumbnailUrl}) no-repeat`, backgroundPositionY: "50%",}}
                             className="image is-full-width is-full-height is-background-size-cover has-border-radius-10" />
                    </div>
                </figure>
                <div style={{overflowY: "hidden"}} className="media-content">
                    <div className="content"  onClick={() => updateActiveContent(content)}>
                        <p className="fa-1x text-overflow-ellipsis has-margin-bottom-5">
                            <FontAwesomeIcon
                                icon={liked ? faStar : fasStar}
                                className="video-like-btn-mobile"
                                color={liked ? STORE_LIKED : ""}
                                size={'sm'}
                                onClick={updateLike} />
                            <strong>{content.store.name}</strong>

                        </p>
                        <p className="has-text-left is-marginless">
                            {content.tagList.map(tag => {
                                return <span key={tag} className="fa-0-77x has-text-link" onClick={(e) => searchTag(e, tag)}>#{tag}</span>
                            })}
                        </p>
                        <p className="has-text-left has-text-grey-light is-marginless fa-0-87x">
                            <small className="has-text-weight-semibold">
                            <span className="video-view-count">
                                <Numbers prefix="조회수 " postfix="회" shorten={true} shortenPrecision={1} shortFormatMinValue={1000}>{content.viewCount}</Numbers>
                            </span>
                                <span className="video-date">
                                {content.registerDate ? (<Moment fromNow>{content.registerDate}</Moment>) : "알수 없음"}
                            </span>
                            </small>
                        </p>
                        <div className="is-flex justify-flex-start">
                            <div className="is-flex">
                                <div className="media-left has-margin-right-10">
                                    <figure className="image is-24x24 is-marginless">
                                        {channel != null
                                            ? <img className="image is-rounded" src={channel.profileImg}/>
                                            :<img className="image has-min-height-24 is-rounded" src={EMPTY_IMAGE}/> }
                                    </figure>
                                </div>
                                <div className="media-content align-self-center">
                                    <p className="fa-0-87x">
                                        {channel != null ? channel.youtubeName : "전체 채널"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default Store;