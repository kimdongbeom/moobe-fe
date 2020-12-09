import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {faArrowUp, faMinus} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import MobileKakaoMap from "components/mobile/map/MobileKakaoMap";
import {animated, useSpring} from "react-spring";
import MobileStoreList from "components/mobile/store/MobileStoreList";
import StoreDetailAnimate from "components/mobile/store/StoreDetail";
import {MOBILE_CONTENT_LIST_BAR, MOBILE_CONTENT_LIST_LOADING} from "assets/styles/colors";
import {fetchContentDetail, resetContentDetailData} from "data/redux/action/contentDetail";
import {useHistory, useLocation, useParams} from "react-router";
import {isEmpty as _isEmpty, isNil as _isNil} from 'lodash';
import {useLastLocation} from "react-router-last-location";
import {LoadingSpinner} from "components/common/layout/PresentUtil";
import LoadingOverlay from "react-loading-overlay";
import queryString from "query-string";
import {buildChannelPath, buildQuery} from "data/util";
import {setFocusedLocation} from "data/redux/action/location";

const MobileHome = () => {
    const [showMoreList, setShowMoreList] = useState(false);
    const [fullList, setFullList] = useState(false);
    const [isHideList, setIsHideList] = useState(true);
    const storeListRef = useRef(null);
    const {channelId, contentId} = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const {query, searchType, page, focused, swLat, swLng, neLat, neLng} = queryString.parse(location.search);

    const {totalCount, contentLoading} = useSelector(state => state.content);
    const {focusedMapLocation} = useSelector(state => state.mapLocation);
    const {channelLoading} = useSelector(state => state.channel);
    const {contentDetail, contentDetailLoading} = useSelector(state => state.contentDetail);
    const {h, overflow, width, bottom} = useSpring({
        h: showMoreList ? (fullList ? 1 : 0.8) : 0,
        overflow: showMoreList || fullList ? "scroll" : "hidden",
        width: fullList ? "100%" : "95%",
        bottom: fullList ? "0" : "calc(2vh)",
        config: {clamp:true, duration: 200}});
    const toggleShowList = (e) => {
        if (fullList) {
            setShowMoreList(false)
            setFullList(false)
        } else if (showMoreList) {
            setFullList(true)
        } else {
            setShowMoreList(true)
        }
    }

    useEffect(() => {
        setShowMoreList(false)
        setFullList(false)
    }, [query, searchType, swLat, swLng, neLat, neLng])

    const closeList = (e) => {
        setShowMoreList(false);
        setFullList(false);
    }
    const slidingHeight = h.interpolate(h => (h * window.innerHeight < 53) ? '53px' : `${h * window.innerHeight}px`);

    const storeListScrollTop = (e) => {
        storeListRef.current.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    }

    useEffect(() => {
        if (!showMoreList && storeListRef != null && storeListRef.current != null) {
            storeListRef.current.scrollTo(0, 0, 2000)
        }
    }, [showMoreList])

    useEffect(() => {
        if (!_isNil(focusedMapLocation)) {
            setShowMoreList(false);
            setFullList(false);
            history.push({
                pathname: location.pathname,
                search: buildQuery(Object.assign(queryString.parse(location.search), {focused: focusedMapLocation.id}))
            });
        }
    }, [focusedMapLocation])

    useEffect(() => {
        if (_isNil(focused)) {
            dispatch(setFocusedLocation(null));
        }
    }, [focused])

    useEffect(() => {
        if (contentId) {
            dispatch(fetchContentDetail(channelId, contentId));
        } else {
            dispatch(resetContentDetailData());
        }
    }, [contentId]);

    const history = useHistory();
    const lastLocation = useLastLocation();
    const backToStoreList = () => {
        if (_isNil(lastLocation)) {
            history.push({
                pathname: buildChannelPath({id: channelId}),
                search: location.search
            });
        } else {
            history.goBack(1);
        }
    };

    const showMoreCallback = (h) => {
        if (h == 0) {
            setIsHideList(true);
        } else {
            setIsHideList(false);
        }
    }

    return (
        <div className="column is-paddingless">
            <StoreDetailAnimate visible={!_isEmpty(contentDetail) || contentDetailLoading} contentDetail={contentDetail} onClickBack={backToStoreList} />
            <div className={"modal modal-background mobile-modal-background-color " + (isHideList ? "" : "is-active")} onClick={closeList}/>
            <animated.div ref={storeListRef} style={{width: width, bottom: bottom, height: slidingHeight, overflowY: overflow, callback: h.interpolate(showMoreCallback)}} className="mobile-video-list box is-paddingless is-bottom-marginless is-bottom-borderless has-text-centered has-cursor-pointer" >
                <LoadingOverlay className={"store-loading-overlay"}
                    active={channelLoading || contentLoading}
                    spinner={<LoadingSpinner color={MOBILE_CONTENT_LIST_LOADING} loading={true}/>}>
                    <div onClick={toggleShowList}>
                        <FontAwesomeIcon className="show-more-rule-icon is-paddingless" icon={faMinus} transform={!fullList ? "rotate-155" : "rotate-205"} size={'1x'} color={MOBILE_CONTENT_LIST_BAR} />
                        <FontAwesomeIcon className="show-more-rule-icon is-paddingless" icon={faMinus} transform={!fullList ? "rotate-25" : "rotate-335"} size={'1x'} color={MOBILE_CONTENT_LIST_BAR} />
                        <div className="has-margin-bottom-15" ><strong>{`목록으로 보기 (${totalCount})`}</strong></div>
                        <hr className="is-marginless"/>
                    </div>
                </LoadingOverlay>
                <MobileStoreList isListVisible={!isHideList}/>
                <button className={"button go-top-button is-rounded is-48x48" + (fullList ? "" : " is-hidden")} >
                    <FontAwesomeIcon icon={faArrowUp} size={"lg"} onClick={storeListScrollTop}/>
                </button>
            </animated.div>
            <MobileKakaoMap />
        </div>
    )
};

const handleDrag = (dragState, h, maxHeight, initValueRange, dragRange, stateChangeRange, currentState, stateChangeFunc) => {
    // example
    // const bind = useDrag((state) => {
    //     if (isClick(state)) {
    //         toggleShowList();
    //     } else {
    //         handleDrag(state, h, modalHeight(), [0, 1], [0.15, 0.5], [0.12, 0.8], showMoreList, setShowMoreList)
    //     }
    //
    // });
    // dragState is state from useDrag
    // h is useSpring target value
    // maxHeight is target max height
    // initValueRange is init value for h ex) [0, 1]
    // dragRange is draggable position for h. can not over initValueRange.
    //      ex) [0.15, 0.7] => 0~0.15, 0.7~1 is draggable position.
    //      when drag is active, h can not over 0.15(currentState is false), h can not under 0.7(currentState is true)
    // stateChangeRange is the position will be change the state when drag ended. can not over dragRange
    //      ex) [0.12, 0.8] => the position is over 0.12(currentState is false) or under 0.8(currentState is true), the state will be changed.
    // currentState. true or false. true mean h is initValue[1], false mean h is initValue[0]
    // stateChangeFunc is function for chage state.
    const [mx, my] = dragState.delta;
    const [initValueUnder, initValueOver] = initValueRange;
    const [dragUnder, dragOver] = dragRange;
    const [stateChangeUnder, stateChangeOver] = stateChangeRange;
    if (dragState.currentTarget.scrollTop !== 0) {
        h.setValue(currentState ? initValueOver : initValueUnder, true);
        return;
    }
    let currentHeight = h.value * maxHeight > 53 ? h.value * maxHeight : 53;
    let afterDragedValue = (my*-1)/maxHeight + currentHeight/maxHeight;
    if (currentState) {
        h.setValue(afterDragedValue < dragOver ? dragOver : afterDragedValue, true)
    } else {
        h.setValue(afterDragedValue > dragUnder ? dragUnder : afterDragedValue, true)
    }
    if (dragState.last) {
        if (dragState.velocity > 1) {
            stateChangeFunc(!currentState);
            return
        }
        if (currentState) {
            if (afterDragedValue < stateChangeOver) {
                stateChangeFunc(!currentState);
            } else {
                h.setValue(initValueOver, true);
            }
        } else {
            if (afterDragedValue > stateChangeUnder) {
                stateChangeFunc(!currentState);
            } else {
                h.setValue(initValueUnder, true);
            }
        }
    }
};

export default MobileHome;