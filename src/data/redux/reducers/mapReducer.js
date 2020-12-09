import {
    MAP_FORCE_CLEAN_MARKER_CLUSTERER,
    MAP_LOADING_GEOLOCATION_FAIL,
    MAP_LOADING_GEOLOCATION_FINISHED,
    MAP_LOADING_GEOLOCATION_STARTED,
    MAP_LOADING_GEOLOCATION_SUCCESS,
    MAP_LOADING_MAP_FAIL,
    MAP_LOADING_MAP_FINISHED,
    MAP_LOADING_MAP_STARTED,
    MAP_LOADING_MAP_SUCCESS,
    MAP_RESET_MAP_CENTER_CHANGE,
    MAP_SEARCH_ON_BOUND_CHANGE,
    MAP_SEARCH_ON_LEVEL_CHANGE,
    MAP_SET_GEOLOCATION_CENTER,
    MAP_SET_MAP_BOUNDS,
    MAP_SET_MAP_BOUNDS_CHANGE,
    MAP_SET_MAP_CENTER,
    MAP_SET_MAP_CENTER_CHANGE,
    MAP_SET_MAP_CENTER_FORCE,
    MAP_SET_MAP_LEVEL,
    MAP_SET_MARKER_CLUSTERER
} from "data/redux/action/map";

import {isMobile} from "react-device-detect";
import {isSimilarLocation, updateObject} from "data/util";

export const initMapLevel = (isMobile ? process.env.REACT_APP_INIT_MAP_LEVEL_MOBILE : process.env.REACT_APP_INIT_MAP_LEVEL) || 13;
export const mapBoundsMargin = isMobile ? [32, 0, 32, 0] : [0, 0, 0, 0];
const initialStateMap = {
    map: null,
    mapRef: null,
    mapLoading: true,
    errorMapLoading: false,
    centerLat: null,
    centerLng: null,
    mapLevel: initMapLevel,
    refreshCenter: 0,
    searchOnBoundChange: false,
    searchOnLevelChange: false,
    enableGeolocation: false,
    geoLocationCenterLat: null,
    geoLocationCenterLng: null,
    geolocationLoading: false,
    centerChanged: false,
    changedCenterLat: null,
    changedCenterLng: null,
    mapBounds: null,
    mapBoundMargins: null,
    changedMapBounds: {
        sw: {
            lat: null,
            lng: null
        },
        ne: {
            lat: null,
            lng: null
        }
    },
    markerClusterer: null,
};

const centerChange = (mapState, changedCenterLat, changedCenterLng) => {
    const centerChanged = !isSimilarLocation({lat: mapState.centerLat, lng: mapState.centerLng}, {lat: changedCenterLat, lng: changedCenterLng}, 2);
    return updateObject(mapState, {centerChanged, changedCenterLat, changedCenterLng});
}

const cleanMarkerClusterer = (mapState) => {
    if (mapState.markerClusterer) {
        mapState.markerClusterer.clear();
    }
    return mapState;
}

export default function(mapState = initialStateMap, action) {
    switch(action.type) {
        case MAP_SET_MAP_CENTER : return updateObject(mapState, {centerLat: action.latlng.lat, centerLng: action.latlng.lng});
        case MAP_SET_MAP_CENTER_FORCE : return updateObject(mapState, {centerLat: action.latlng.lat, centerLng: action.latlng.lng, refreshCenter: mapState.refreshCenter + 1});
        case MAP_SET_MAP_CENTER_CHANGE : return centerChange(mapState, action.latlng.lat, action.latlng.lng)
        case MAP_SET_MAP_BOUNDS : return updateObject(mapState, {mapBounds: action.mapBounds, mapBoundMargins: action.mapBoundMargins});
        case MAP_SET_MAP_BOUNDS_CHANGE : return updateObject(mapState, {changedMapBounds: action.changedMapBounds});
        case MAP_SET_MAP_LEVEL : return updateObject(mapState, {mapLevel: action.level ? action.level : initMapLevel});
        case MAP_RESET_MAP_CENTER_CHANGE : return updateObject(mapState, {centerChanged: false, changedCenterLat: null, changedCenterLng: null});
        case MAP_LOADING_MAP_STARTED : return updateObject(mapState, {mapLoading: true});
        case MAP_LOADING_MAP_FINISHED : return updateObject(mapState, {mapLoading: false});
        case MAP_LOADING_MAP_SUCCESS : return updateObject(mapState, {map: action.map, mapRef: action.mapRef, kakao: action.kakao, errorMapLoading: false});
        case MAP_LOADING_MAP_FAIL : return updateObject(mapState, {map: null, errorMapLoading: true});
        case MAP_SET_GEOLOCATION_CENTER : return updateObject(mapState, {geoLocationCenterLat: action.latlng.lat, geoLocationCenterLng: action.latlng.lng});
        case MAP_LOADING_GEOLOCATION_STARTED : return updateObject(mapState, {geolocationLoading: true});
        case MAP_LOADING_GEOLOCATION_FINISHED : return updateObject(mapState, {geolocationLoading: false});
        case MAP_LOADING_GEOLOCATION_SUCCESS : return updateObject(mapState, {enableGeolocation: true});
        case MAP_LOADING_GEOLOCATION_FAIL : return updateObject(mapState, {enableGeolocation: false});
        case MAP_SEARCH_ON_BOUND_CHANGE : return updateObject(mapState, {searchOnBoundChange: action.searchOnBoundChange});
        case MAP_SEARCH_ON_LEVEL_CHANGE : return updateObject(mapState, {searchOnLevelChange: action.searchOnLevelChange});
        case MAP_SET_MARKER_CLUSTERER : return updateObject(mapState, {markerClusterer: action.markerClusterer});
        case MAP_FORCE_CLEAN_MARKER_CLUSTERER : return cleanMarkerClusterer(mapState);
        default : return mapState;
    }
}


