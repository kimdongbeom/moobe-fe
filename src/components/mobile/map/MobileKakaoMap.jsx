import React, {useEffect, useState} from 'react';
import MoobeKakaoMap from "components/common/map/MoobeKakaoMap";
import MarkerClusterer, {MarkerClustererCalculator, MarkerClustererStyles} from "components/common/map/MarkerClusterer";
import {useDispatch, useSelector} from "react-redux";
import MarkerImageSm from 'assets/images/marker_arrow_sm.svg';
import MarkerImagePin from 'assets/images/marker_arrow_pin.svg';
import MarkerImagePinFavorite from 'assets/images/marker_arrow_pin_favorite.png';
import CustomOverlay from "components/common/map/CustomOverlay";
import MapLocationOverlay from "components/common/map/MapLocationOverlay";
import {isEmpty as _isEmpty, isNil as _isNil} from 'lodash'
import Marker from "components/common/map/Marker";
import {useHistory, useLocation} from "react-router";
import {buildContentPath} from "data/util";
import {setFocusedLocation} from "data/redux/action/location";
import {forceCleanMarkerClusterer, setMapBounds, setSearchOnBoundChange} from "data/redux/action/map";
import {getContent} from "data/api";
import ClusterMarker from "components/common/map/ClusterMarker";
import MapLocation from "data/redux/model/MapLocation";
import {mapBoundsMargin} from "data/redux/reducers/mapReducer";

const MobileKakaoMap = () => {
    const [focusedLocationLiked, setFocusedLocationLiked] = useState(false);
    const {mapClusterLocationList, mapClusterLocationMarkerSize, mapClusterLocationMarkerList} = useSelector(state => state.mapClusterLocation);
    const {map, mapLevel, mapLoading} = useSelector(state => state.map);
    const {mapLocationList, mapLocationLoading, focusedMapLocation} = useSelector(state => state.mapLocation);
    const dispatch = useDispatch();

    const getLocationListWithoutFocusedContent = () => {
        if (!_isNil(focusedMapLocation)) {
            return mapLocationList.filter(mapLocation => mapLocation.id != focusedMapLocation.id)
        } else {
            return mapLocationList;
        }
    }

    const getClusterLocationListWithoutFocusedContent = () => {
        if (!_isNil(focusedMapLocation)) {
            return mapClusterLocationMarkerList.filter(location => location.id != focusedMapLocation.id)
        } else {
            return mapClusterLocationMarkerList
        }
    }

    useEffect(() => {
        if (focusedMapLocation) {
            getContent(focusedMapLocation.id).then(response => {
                if (response && response.data) {
                    setFocusedLocationLiked(response.data.liked)
                }
            })
        }
        return () => setFocusedLocationLiked(false)
    }, [focusedMapLocation])

    const onClickMarker = (mapLocation) => {
        dispatch(setFocusedLocation(mapLocation))
    }

    const onClusterClick = (cluster) => {
        if(map) {
            const latLngList = cluster.getMarkers().map(m => {
                return {lat: m.mapLocation.latitude, lng: m.mapLocation.longitude}
            })
            dispatch(forceCleanMarkerClusterer());
            dispatch(setFocusedLocation(null));
            dispatch(setSearchOnBoundChange(true))
            dispatch(setMapBounds(latLngList, mapBoundsMargin));
        }
    }

    const renderSingleClusterMarker = (mapClusterLocation) => {
        let mapLocation = new MapLocation(mapClusterLocation.markerList[0])
        return alwaysShowLocationOverlay
            ? <MarkerWithCustomOverlay key={mapLocation.id} mapLocation={mapLocation} hasShadow={false}
                                       markerOptions={{imageUrl: MarkerImageSm, imageOption: {width: 30, height: 32}}} onClick={(e) => onClickMarker(mapLocation)}
                                       overlayOffsetY={38}/>
            : <Marker key={mapLocation.id} onClick={(marker) => onClickMarker(mapLocation)}
                      options={{lat: mapLocation.latitude, lng: mapLocation.longitude, content: mapLocation.name, imageUrl: MarkerImageSm, imageOption: {width: 30, height: 32}}}
                      attributes={{mapLocation}}/>
    }

    const renderClusterFocusedMarker = (mapLocation) => {
        return (
            <MarkerWithCustomOverlay key={focusedMapLocation.id}
                                     mapLocation={focusedMapLocation}
                                     markerOptions={{imageUrl: focusedLocationLiked ? MarkerImagePinFavorite : MarkerImagePin, imageOption: {width: 46, height: 61}}}
                                     zIndex={3} />
        )
    }

    const alwaysShowLocationOverlay =  !mapLocationLoading && !_isEmpty(mapLocationList) && !mapLoading && (mapLevel < 5 || mapLocationList.length <= 6)
    const alwaysShowClusterLocationOverlay = !mapLoading && (mapClusterLocationMarkerSize <= 6 || mapLevel < 5)

    return (
        <>
            <MoobeKakaoMap className="column is-paddingless kakao-map is-fullheight-with-navbar-mobile is-marginless" zoom={false}>
                {/*single marker*/}
                <MarkerClusterer options={{
                    averageCenter: false,
                    minLevel: 5,
                    disableClickZoom: true,
                    minClusterSize: 3,
                    calculator: MarkerClustererCalculator,
                    styles: MarkerClustererStyles
                }} onClusterClick={onClusterClick}>
                    {getLocationListWithoutFocusedContent().map(mapLocation =>
                        alwaysShowLocationOverlay
                        ? <MarkerWithCustomOverlay key={mapLocation.id} mapLocation={mapLocation} hasShadow={false}
                                                   markerOptions={{imageUrl: MarkerImageSm, imageOption: {width: 30, height: 32}}} onClick={(e) => onClickMarker(mapLocation)}
                                                   overlayOffsetY={38}/>
                        : <Marker key={mapLocation.id} onClick={(marker) => onClickMarker(mapLocation)}
                                options={{lat: mapLocation.latitude, lng: mapLocation.longitude, content: mapLocation.name, imageUrl: MarkerImageSm, imageOption: {width: 30, height: 32}}}
                                attributes={{mapLocation}}/>
                    )}
                </MarkerClusterer>
                {/*focused marker overlay (after click marker)*/}
                {!_isNil(focusedMapLocation)
                    ? <MarkerWithCustomOverlay key={focusedMapLocation.id}
                                                                        mapLocation={focusedMapLocation}
                                                                        markerOptions={{imageUrl: focusedLocationLiked ? MarkerImagePinFavorite : MarkerImagePin, imageOption: {width: 46, height: 61}}}
                                                                        zIndex={3} />
                    : alwaysShowClusterLocationOverlay
                        ? getClusterLocationListWithoutFocusedContent().map(mapLocation =>
                            <MarkerWithCustomOverlay key={mapLocation.id} mapLocation={mapLocation} hasShadow={false}
                                                     markerOptions={{imageUrl: MarkerImageSm, imageOption: {width: 30, height: 32}}} onClick={(e) => onClickMarker(mapLocation)}
                                                     overlayOffsetY={38}/>)
                        : mapClusterLocationList.map(m => <ClusterMarker key={m.centerLatitude + "" + m.centerLongitude + "" + m.markerListSize}
                                                                    mapClusterLocation={m}
                                                                    renderFocusedMarker={renderClusterFocusedMarker}
                                                                    renderSingleMarker={renderSingleClusterMarker} />)}
            </MoobeKakaoMap>
        </>
    )
};

const MarkerWithCustomOverlay = ({mapLocation, hasShadow=true, showTag=true, showArrow=true, onClick=null, markerOptions={}, overlayOffsetY=72, zIndex=1}) => {
    const {activeChannel} = useSelector(state => state.channel);
    const history = useHistory();
    const location = useLocation();
    const updateOverlayContent = (mapLocation) => {
        if (onClick) {
            onClick()
        } else {
            history.push({
                pathname: buildContentPath(activeChannel, mapLocation),
                search: location.search
            });
        }

    };

    return (
        <>
            <Marker onClick={(marker) => updateOverlayContent(mapLocation)}
                options={Object.assign({lat: mapLocation.latitude, lng: mapLocation.longitude, content: mapLocation.name, imageUrl: MarkerImagePin, imageOption: {width: 46, height: 61}, zIndex: zIndex}, markerOptions)}
                attributes={{mapLocation}}/>
            <CustomOverlay lat={mapLocation.latitude} lng={mapLocation.longitude} visible={true} options={{offsetY: overlayOffsetY, zIndex: zIndex}}>
                <MapLocationOverlay mapLocation={mapLocation} hasShadow={hasShadow} handleClick={onClick} showTag={showTag} showArrow={showArrow} />
            </CustomOverlay>
        </>
    )
};


export default MobileKakaoMap;