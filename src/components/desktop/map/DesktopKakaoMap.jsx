import React, {useEffect, useState} from 'react';
import MoobeKakaoMap from "components/common/map/MoobeKakaoMap";
import MarkerClusterer, {MarkerClustererCalculator, MarkerClustererStyles} from "components/common/map/MarkerClusterer";
import {useDispatch, useSelector} from "react-redux";
import MarkerImageSm from 'assets/images/marker_arrow_sm.svg';
import MarkerImagePin from 'assets/images/marker_arrow_pin.svg';
import MarkerImagePinFavorite from 'assets/images/marker_arrow_pin_favorite.png';
import CustomOverlay from "components/common/map/CustomOverlay";
import DetailContentOverlay from "components/common/map/DetailContentOverlay";
import {isEmpty as _isEmpty, isNil as _isNil} from 'lodash';
import {buildContentPath} from "data/util";
import {useHistory, useLocation, useParams} from "react-router";
import Marker from "components/common/map/Marker";
import {setShowOverlayContentDetail} from "data/redux/action/contentDetail";
import {setFocusedLocation} from "data/redux/action/location";
import MapLocationOverlay from "components/common/map/MapLocationOverlay";
import {forceCleanMarkerClusterer, setMapBounds, setSearchOnBoundChange} from "data/redux/action/map";
import MapLocation from "data/redux/model/MapLocation";
import ClusterMarker from "components/common/map/ClusterMarker";
import {mapBoundsMargin} from "data/redux/reducers/mapReducer";

const DesktopKakaoMap = () => {
    const {mapClusterLocationList, mapClusterLocationMarkerSize, mapClusterLocationMarkerList} = useSelector(state => state.mapClusterLocation);
    const {mapLocationList, mapLocationLoading, focusedMapLocation} = useSelector(state => state.mapLocation);
    const {map, mapLevel, mapLoading} = useSelector(state => state.map);
    const {contentLoading} = useSelector(state => state.content);
    const {contentDetail, showOverlayContentDetail} = useSelector(state => state.contentDetail);
    const dispatch = useDispatch()
    const history = useHistory();

    const getLocationListWithoutDetailContent = () => {
        if (!_isNil(contentDetail)) {
            return mapLocationList.filter(location => location.id != contentDetail.id)
        } else {
            return mapLocationList;
        }
    }

    const getClusterLocationListWithoutDetailContent = () => {
        if (!_isNil(contentDetail)) {
            return mapClusterLocationMarkerList.filter(location => location.id != contentDetail.id)
        } else {
            return mapClusterLocationMarkerList
        }
    }

    const getClusterLocationWithoutDetailContent = () => {
        if (!_isNil(contentDetail)) {
            return mapClusterLocationList.filter(clusterLocation => !clusterLocation.markerList.map(marker => marker.id == contentDetail.id).reduce((a, b) => a || b))

        } else {
            return mapClusterLocationMarkerList
        }
    }

    const onClusterClick = (cluster) => {
        if(map) {
            const latLngList = cluster.getMarkers().map(m => {
                return {lat: m.mapLocation.latitude, lng: m.mapLocation.longitude}
            })
            dispatch(forceCleanMarkerClusterer());
            dispatch(setSearchOnBoundChange(true))
            dispatch(setMapBounds(latLngList, mapBoundsMargin))
        }
    }

    const renderSingleClusterMarker = (mapClusterLocation) => {
        return contentDetail && contentDetail.id != mapClusterLocation.markerList[0].id
            ? <MarkerWithFocusedOverlay key={mapClusterLocation.markerList[0].id}
                                        mapLocation={new MapLocation(mapClusterLocation.markerList[0])}
                                        visible={false}
                                        isFocusedMarker={focusedMapLocation && focusedMapLocation.id == mapClusterLocation.markerList[0].id}/>
            : null
    }

    const renderClusterFocusedMarker = (mapLocation) => {
        return (
            <CustomOverlay lat={mapLocation.latitude} lng={mapLocation.longitude} visible={true} options={{offsetY: 38, zIndex: 3}}>
                <MapLocationOverlay mapLocation={mapLocation}
                                    hasShadow={true}
                                    hoverShadow={true}/>
            </CustomOverlay>
        )
    }

    const alwaysShowLocationOverlay =  !mapLocationLoading && !_isEmpty(mapLocationList) && !mapLoading && (mapLocationList.length <= 6 || mapLevel < 5)
    const alwaysShowClusterLocationOverlay = !mapLoading && (mapClusterLocationMarkerSize <= 6 || mapLevel < 5)

    return (
        <>
            <MoobeKakaoMap className="column box is-paddingless kakao-map is-fullheight-with-navbar-fixed-height is-marginless" zoom={true}>
                {/*single marker*/}
                <MarkerClusterer
                    isMain={true}
                    options={{
                    averageCenter: true,
                    minLevel: 5,
                    disableClickZoom: true,
                    minClusterSize: 3,
                    calculator: MarkerClustererCalculator,
                    styles: MarkerClustererStyles
                }} onClusterClick={onClusterClick}>
                    {getLocationListWithoutDetailContent().map(mapLocation =>
                        <MarkerWithFocusedOverlay key={mapLocation.id}
                                                  mapLocation={mapLocation}
                                                  visible={alwaysShowLocationOverlay}
                                                  isFocusedMarker={focusedMapLocation && focusedMapLocation.id == mapLocation.id}
                                                  hasShadow={!alwaysShowLocationOverlay || (focusedMapLocation && focusedMapLocation.id == mapLocation.id)}
                                                  hoverShadow={alwaysShowLocationOverlay}
                        />)}
                </MarkerClusterer>

                {/*detail marker*/}
                {!_isEmpty(contentDetail)
                    ? <MarkerWithCustomOverlay content={contentDetail} liked={contentDetail && contentDetail.liked ? true : false} visible={showOverlayContentDetail}/>
                    : alwaysShowClusterLocationOverlay
                        ? getClusterLocationListWithoutDetailContent().map(mapLocation =>
                            <MarkerWithFocusedOverlay key={mapLocation.id}
                                                      mapLocation={mapLocation}
                                                      visible={alwaysShowClusterLocationOverlay}
                                                      isFocusedMarker={focusedMapLocation && focusedMapLocation.id == mapLocation.id}
                                                      hasShadow={!alwaysShowClusterLocationOverlay || (focusedMapLocation && focusedMapLocation.id == mapLocation.id)}
                                                      hoverShadow={alwaysShowClusterLocationOverlay}/>)
                        : mapClusterLocationList.map(m => <ClusterMarker key={m.centerLatitude + "" + m.centerLongitude + "" + m.markerListSize}
                                                                         mapClusterLocation={m}
                                                                         renderFocusedMarker={renderClusterFocusedMarker}
                                                                         renderSingleMarker={renderSingleClusterMarker} />)}
            </MoobeKakaoMap>
        </>
    )
};

const MarkerWithCustomOverlay = ({content, liked, visible}) => {
    const dispatch = useDispatch();
    const showOverlay = () => {
        dispatch(setShowOverlayContentDetail(true))
        dispatch(setFocusedLocation(null))
    }

    useEffect(() => {
        dispatch(setFocusedLocation(null))
    }, [content])

    return (
        <>
            <Marker options={{lat: content.store.latitude, lng: content.store.longitude, content: content.store.name, zIndex: 2,
                            imageUrl: liked ? MarkerImagePinFavorite : MarkerImagePin,
                            imageOption: {url: liked ? MarkerImagePinFavorite : MarkerImagePin, width: 46, height: 61}}}
                onClick={(marker) => showOverlay()}
            />
            <CustomOverlay lat={content.store.latitude} lng={content.store.longitude} visible={visible} options={{offsetY: 72, zIndex: 2}}>
                <DetailContentOverlay content={content} visible={visible}/>
            </CustomOverlay>
        </>
    )
}

const MarkerWithFocusedOverlay = ({mapLocation, visible=false, isFocusedMarker = false, hasShadow=true, hoverShadow=false}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [zIndex, setZIndex] = useState(1);
    const {activeChannel} = useSelector(state => state.channel);
    const {focusedMapLocation} = useSelector(state => state.mapLocation);
    let focused = (!_isNil(focusedMapLocation) && mapLocation.id === focusedMapLocation.id) || isFocused || isFocusedMarker;
    const history = useHistory();
    const location = useLocation();
    const {channelId, contentId} = useParams();
    const updateActiveContent = (content) => {
        console.log("click active channel ", activeChannel, channelId, contentId)
        history.push({
            pathname: buildContentPath(activeChannel ? activeChannel : channelId ? {id: channelId} : null, content),
            search: window.location.search
        });
    };
    //TODO seperate overlay div.
    useEffect(() => {
        if (isFocused || isFocusedMarker) {
            setZIndex(3)
        } else {
            setZIndex(1)
        }
    }, [isFocused, isFocusedMarker])

    return (
        <>
            <Marker onMouseOver={(e) => setIsFocused(true)}
                onMouseOut={(e) => setIsFocused(false)}
                onClick={(marker) => updateActiveContent(mapLocation)}
                options={{lat: mapLocation.latitude, lng: mapLocation.longitude, content: mapLocation.name,
                    imageUrl: MarkerImageSm,
                    imageOption: {url: MarkerImageSm, width: 30, height: 32},
                    zIndex: zIndex}}
                attributes={{mapLocation}}
            />
            <CustomOverlay lat={mapLocation.latitude} lng={mapLocation.longitude} visible={visible || focused} options={{offsetY: 38, zIndex: zIndex}}>
                <MapLocationOverlay mapLocation={mapLocation}
                                    hasShadow={hasShadow}
                                    hoverShadow={hoverShadow}
                                    handleMouseEnter={(e) => setIsFocused(true)}
                                    handleMouseLeave={(e) => setIsFocused(false)} />
            </CustomOverlay>
        </>
    )
};


export default DesktopKakaoMap;