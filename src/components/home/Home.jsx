import React, {useEffect} from 'react';
import {fetchContentList} from "data/redux/action/content";
import {useDispatch, useSelector} from "react-redux";
import DesktopHome from "components/home/DesktopHome";
import MobileHome from "components/home/MobileHome";
import queryString from 'query-string'
import {useMobile} from "components/common/layout/WindowDimensions";
import {useLocation, useParams} from "react-router";
import {fetchChannel} from "data/redux/action/channel";
import {forceCleanMarkerClusterer, resetMapCenterChange} from "data/redux/action/map";
import {isNil as _isNil} from 'lodash';
import {buildMoobeMapBounds} from "data/util";
import {fetchLocation, resetLocationData, resetLocationList} from "data/redux/action/location";
import {fetchClusterLocation, resetClusterLocationData} from "data/redux/action/clusterLocation";

const MoobeHome = () => {
    const {channelId} = useParams();
    const {mapLoading, searchOnBoundChange} = useSelector(state => state.map)
    const {query, searchType, page, swLat, swLng, neLat, neLng, level, k} = queryString.parse(useLocation().search); // k for force refresh
    const queryMapBounds = buildMoobeMapBounds(swLat, swLng, neLat, neLng);
    const mobile = useMobile();
    const dispatch = useDispatch();

    useEffect(() => {
        if (mapLoading) {
            return ;
        }
        dispatch(resetLocationData());
        dispatch(fetchChannel(channelId));
        searchLocation();
        searchContent();
    }, [channelId]);

    useEffect(() => {
        if (mapLoading || searchOnBoundChange) {
            return ;
        }
        searchLocation()
        return () => {
            dispatch(forceCleanMarkerClusterer());
            dispatch(resetLocationList());
        }
    }, [query, searchType, k])

    useEffect(() => {
        if (mapLoading || searchOnBoundChange) {
            return ;
        }
        searchContent()
    }, [query, searchType, page, k])

    useEffect(() => {
        if (mapLoading) {
            return ;
        }
        dispatch(fetchChannel(channelId));
        searchLocation();
        searchContent();
    }, [mapLoading])

    const searchLocation = () => {
        if ((!_isNil(level) && level < 6) || !_isNil(query)) {
            dispatch(resetClusterLocationData());
            dispatch(fetchLocation(channelId, query, searchType, queryMapBounds));
        } else {
            dispatch(resetLocationList());
            dispatch(fetchClusterLocation(channelId, level, queryMapBounds))
        }
    }

    const searchContent = () => {
        dispatch(fetchContentList(channelId, query, searchType, queryMapBounds, page, false, fetchContentCallback));
    }
    const fetchContentCallback = (channelId, contentId) => {
        dispatch(resetMapCenterChange());
    };

    return (
        <>
            {!mobile ? <DesktopHome /> : <MobileHome />}
        </>
    )
};

export default MoobeHome;