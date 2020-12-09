import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faStar} from "@fortawesome/free-solid-svg-icons";
import {faStar as fasStar} from "@fortawesome/free-regular-svg-icons";
import YouTube from "react-youtube";
import CommentList from "components/common/comment/CommentList";
import withKakaoMap from "components/common/map/WithKakaoMap";
import StaticKakaoMap from "components/common/map/StaticKakaoMap";
import {buildContentPath, nullFunction} from "data/util";
import {STORE_LIKED} from "assets/styles/colors";
import {requireUser} from "data/redux/action/user";
import {fetchUpdateContentLike, updateContentUpdated} from "data/redux/action/content";
import {isEmpty as _isEmpty} from 'lodash'
import {resetContentDetailData} from "data/redux/action/contentDetail";
import {LoadingStore} from "components/common/layout/PresentUtil";
import withJs from "components/common/map/WithJs";
import {animated, useSpring} from "react-spring";
import {getWindowDimensions} from "components/common/layout/WindowDimensions";
import {useHistory} from "react-router";
import YoutubeMetric from "components/common/youtube/Metric";
import {setFocusedLocation} from "data/redux/action/location";
import MapLocation from "data/redux/model/MapLocation";
import NaverIco from 'assets/images/naver.png';
import NaverMap from 'assets/images/naver_map.png';
import KakaoMap from 'assets/images/kakao_map.png';


const Loading = () => (
    <div className="row">
        <div className="column overlay-navbar-mobile has-text-centered">
            <FontAwesomeIcon className="is-pulled-left" icon={faChevronLeft} size={'2x'}/>
        </div>
        <div className="column overlay-content-mobile is-fullheight-with-navbar-mobile is-marginless is-paddingless is-full has-background-white">
            <LoadingStore />
        </div>
    </div>
);

const StaticKakao = withJs(
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
        process.env.REACT_APP_KAKAO_API_KEY
    }&libraries=services,clusterer,drawing&autoload=false`
)(withKakaoMap(StaticKakaoMap));

const StoreDetailAnimate = ({visible, contentDetail, onClickBack, callbackShow = nullFunction, callbackHide = nullFunction}) => {
    const {width, height} = getWindowDimensions(); //need reaction on inner height
    const {marginLeft} = useSpring({marginLeft: visible ? 0 : width, duration: 150});
    const callback = (m) => {
        if (m == 0) { //margin 0
            if (callbackShow) callbackShow()
        } else if (m == width) { //margin width.
            if (callbackShow) callbackHide()
        }
        return true;
    }
    useEffect(() => {
    }, [visible])
    return (
        <animated.div style={{
            marginLeft: marginLeft,
            display: marginLeft.interpolate(m => m >= width ? 'none': 'unset'),
            callback: marginLeft.interpolate(callback)
        }} className="hero is-fullheight-overlay-mobile is-full has-background-white">
            {!_isEmpty(contentDetail) ? <StoreDetail contentDetail={contentDetail} onClickBack={onClickBack} /> : <Loading />}
        </animated.div>
    )
}
const StoreDetail = ({contentDetail, onClickBack, isOverlayed}) => {
    const [stickyInfo, setStickyInfo] = useState({
        isSticky: false,
        calculatedHeight: 0
    });
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsVisible(true);
        return () => {
            dispatch(resetContentDetailData());
            setIsVisible(false);
        }
    }, [])

    return (
        <>
        {!contentDetail || !isVisible
            ? <Loading />
            : <div className="row">
                <StoreDetailTitle contentDetail={contentDetail} onClickBack={onClickBack} />
                <div className="column overlay-content-mobile is-fullheight-with-navbar-mobile is-marginless is-paddingless is-full has-background-white">
                    <StoreDetailContent contentDetail={contentDetail} />
                    <hr className="divider has-background-grey-lighter is-top-marginless"/>
                    <div className="has-background-white has-padding-right-10 has-padding-left-10">
                        <YouTube
                            videoId={contentDetail.videoLinkId}                  // defaults -> null
                            id={contentDetail.videoLinkId}                       // defaults -> null
                            className="youtube-container-mobile"                // defaults -> null
                            containerClassName="column has-text-centered is-full is-marginless is-paddingless is-top-borderless"       // defaults -> ''
                            opts={{playerVars: {playsinline: 1}}}
                            // onReady={func}                    // defaults -> noop
                            // onPlay={func}                     // defaults -> noop
                            // onPause={func}                    // defaults -> noop
                            // onEnd={func}                      // defaults -> noop
                            // onError={func}                    // defaults -> noop
                            // onStateChange={func}              // defaults -> noop
                            // onPlaybackRateChange={func}       // defaults -> noop
                            // onPlaybackQualityChange={func}    // defaults -> noop
                        />
                    </div>
                    <YoutubeMetric content={contentDetail} />
                    <hr className="divider has-background-grey-lighter"/>
                    <CommentList content={contentDetail} />
                </div>
            </div>
        }
        </>
    )
};

const StoreDetailTitle = ({contentDetail, onClickBack}) => {
    return (
        <div className={"column is-fixed-top overlay-navbar-mobile text-overflow-ellipsis has-text-centered"}>
            <FontAwesomeIcon className="is-pulled-left has-margin-right-15" icon={faChevronLeft} size={'2x'}
                             onClick={onClickBack}/>
            {/*<span><strong>{contentDetail.title}</strong></span>*/}
        </div>
    );
}

const StoreDetailContent = ({contentDetail}) => {
    const [liked, setLiked] = useState(contentDetail.liked);
    const store = !_isEmpty(contentDetail) ? contentDetail.store : {};
    const {activeChannel} = useSelector(state => state.channel);
    const dispatch = useDispatch();
    const history = useHistory();

    const updateLike = () => {
        let origin = liked;
        let updated = !liked;
        dispatch(requireUser((user) => {
            setLiked(updated);
            dispatch(fetchUpdateContentLike(user.email, contentDetail.id, updated,() => {
                dispatch(updateContentUpdated(contentDetail, {liked: updated}));
                dispatch(setFocusedLocation(new MapLocation(contentDetail)))
            },() => setLiked(origin)));
        }));
    }
    useEffect(() => {
        setLiked(contentDetail ? contentDetail.liked : false)
    }, [contentDetail])

    const onClickKakaoMap = (e) => {
        history.push({
            pathname: buildContentPath(activeChannel, null),
            search: location.search
        });
        dispatch(setFocusedLocation(new MapLocation(contentDetail)))
        e.stopPropagation();
    }
    const openUrl = (e) => {
        if (!confirm("네이버에서 검색하시겠습니까?")) return;
        window.open(store.link, "_blank");
    };
    const openNaverMap = (e) => {
        window.location.href =`nmap://place?name=${store.name}&lat=${store.latitude}&lng=${store.longitude}&appname=moobe.co.kr`
    }
    const openKakaoMap = (e) => {
        window.location.href =`kakaomap://look?p=${store.latitude},${store.longitude}`
    }
    return (
        <div className="column is-paddingless is-full">
            <div className="card-content is-top-paddingless">
                <p className="is-marginless has-text-left">
                    <span className="title is-size-5 is-family-sans-serif">
                        {store.name}
                    </span>
                </p>
                <hr className="is-marginless has-margin-bottom-5 has-background-grey-lighter"/>
                <div className="has-text-right has-margin-bottom-15">
                    <FontAwesomeIcon
                        icon={liked ? faStar : fasStar}
                        className="has-margin-right-5 clickable"
                        color={liked ? STORE_LIKED : ""}
                        size={'lg'}
                        onClick={updateLike}/>
                    <img src={NaverMap} className="image is-inline is-24x24 box is-paddingless vertical-align-top has-margin-right-5 clickable" onClick={openNaverMap}/>
                    <img src={KakaoMap} className="image is-inline is-24x24 box is-paddingless vertical-align-top has-margin-right-5 clickable" onClick={openKakaoMap}/>
                    {store.link ? <img src={NaverIco} className="image is-inline is-24x24 box is-paddingless vertical-align-top has-margin-right-5 clickable" onClick={openUrl}/> : null}
                </div>
                <StaticKakao className="box is-paddingless is-full has-height-150"
                             onClick={onClickKakaoMap}
                             options={{
                                 lat: store.latitude,
                                 lng: store.longitude,
                                 level: 4,
                                 markerOptions: {lat: store.latitude, lng: store.longitude, text: "가게위치"}
                             }}/>
                <div className="content is-family-sans-serif">
                    <p className="is-size-6 has-margin-bottom-5">{store.address1}</p>
                    <p className="is-size-6 has-margin-bottom-10"><span
                        className="tag is-info is-rounded is-normal has-text-weight-bold has-margin-right-5">지번</span>{store.address2}
                    </p>
                    <p className="is-size-7 has-margin-bottom-5 has-text-link">{store.tel}</p>
                    <p className="is-size-7 has-margin-bottom-5">{store.availableTime}</p>
                </div>
            </div>
        </div>
    )
}

export default StoreDetailAnimate;