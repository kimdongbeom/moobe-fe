import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearchLocation} from "@fortawesome/free-solid-svg-icons";
import {
    buildChannelPath,
    buildContentPath,
    buildQuery,
    getSearchQueryParams,
    getSearchQueryText,
    isSimilarLocation,
    updateObject
} from "data/util";
import {useHistory, useLocation, useParams} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {isEmpty as _isEmpty} from "lodash";
import queryString from "query-string";
import {setSearchOnBoundChange, setSearchOnLevelChange} from "data/redux/action/map";
import {setFocusedLocation} from "data/redux/action/location";
import {uuid} from "bulma-extensions/bulma-carousel/src/js/utils";
import {isMobile} from "react-device-detect";

const SearchCurrentButton = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [lastSearchCenter, setLastSearchCenter] = useState({lat: null, lng: null});
    const {activeChannel} = useSelector(state => state.channel);
    const {contentList, contentLoading} = useSelector(state => state.content);
    const {changedCenterLat, changedCenterLng, centerChanged, mapLoading, changedMapBounds, searchOnBoundChange, mapLevel, searchOnLevelChange} = useSelector(state => state.map);
    const location = useLocation();
    const {channelId} = useParams();
    const {query, searchType} = queryString.parse(location.search);

    const search = (e) => {
        if (e) e.target.blur();
        setLastSearchCenter({lat: changedCenterLat, lng: changedCenterLng});
        dispatch(setFocusedLocation(null))
        let queryParams = updateObject(getSearchQueryParams(query, searchType),
            {
                page: 1,
                swLat: changedMapBounds.sw.lat,
                swLng: changedMapBounds.sw.lng,
                neLat: changedMapBounds.ne.lat,
                neLng: changedMapBounds.ne.lng,
                level: mapLevel,
                k: uuid().substring(0, 5)
            });
        history.push({
            pathname: buildChannelPath(channelId ? {id: channelId} : activeChannel ? activeChannel : null),
            search: buildQuery(queryParams)
        });

    };

    const searchCurrentLocationText = () => {
        if (!_isEmpty(query)) {
            return "현재 지도에서 [" + getSearchQueryText(query, searchType) + "] 다시 찾기";
        }
        return "현재 지도에서 찾기"
    }

    const isVisible = () => {
        if (centerChanged && !isSimilarLocation(lastSearchCenter, {lat: changedCenterLat, lng: changedCenterLng}, isMobile ? 2 : 3)) {
            if (contentLoading) {
                return true
            }
            if (contentList.length == 0) {
                return false
            }
            return true
        } else {
            return false
        }
    }

    useEffect(() => {
        if (searchOnBoundChange && changedMapBounds && !mapLoading) {
            search();
            dispatch(setSearchOnBoundChange(false))
        }
    }, [changedMapBounds, mapLoading])

    useEffect(() => {
        if (searchOnLevelChange && mapLevel && !mapLoading) {
            search();
            dispatch(setSearchOnLevelChange(false));
        }
    }, [mapLevel, mapLoading])


    return (
        <button className={"location-search-button button " + (contentLoading? " is-loading" : "") + (isVisible() ? "" : " is-hidden")} onClick={search}>
            <span className="icon">
                <FontAwesomeIcon icon={faSearchLocation} size={"sm"} />
            </span>
            <span>{searchCurrentLocationText()}</span>
        </button>
    )
};

export default SearchCurrentButton;