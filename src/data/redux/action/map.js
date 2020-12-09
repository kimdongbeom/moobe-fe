export const MAP_SET_MAP_CENTER = 'MAP/SET_MAP_CENTER';
export const MAP_SET_MAP_CENTER_FORCE = 'MAP/SET_MAP_CENTER_FORCE';
export const MAP_SET_MAP_CENTER_CHANGE = 'MAP/SET_MAP_CENTER_CHANGE';
export const MAP_SET_MAP_BOUNDS = 'MAP/SET_MAP_BOUNDS';
export const MAP_SET_MAP_BOUNDS_CHANGE = 'MAP/SET_MAP_BOUNDS_CHANGE';
export const MAP_SET_MAP_LEVEL = 'MAP/SET_MAP_LEVEL';
export const MAP_RESET_MAP_CENTER_CHANGE = 'MAP/MAP_RESET_MAP_CENTER_CHANGE';
export const MAP_LOADING_MAP_STARTED = 'MAP/LOADING_MAP_STARTED';
export const MAP_LOADING_MAP_FINISHED = 'MAP/LOADING_MAP_FINISHED';
export const MAP_LOADING_MAP_SUCCESS = 'MAP/LOADING_MAP_SUCCESS';
export const MAP_LOADING_MAP_FAIL = 'MAP/LOADING_MAP_FAIL';
export const MAP_SET_GEOLOCATION_CENTER = 'MAP/SET_GEOLOCATION_CENTER';
export const MAP_LOADING_GEOLOCATION_STARTED = 'MAP/LOADING_GEOLOCATION_STARTED';
export const MAP_LOADING_GEOLOCATION_FINISHED = 'MAP/LOADING_GEOLOCATION_FINISHED';
export const MAP_LOADING_GEOLOCATION_SUCCESS = 'MAP/LOADING_GEOLOCATION_SUCCESS';
export const MAP_LOADING_GEOLOCATION_FAIL = 'MAP/LOADING_GEOLOCATION_FAIL';
export const MAP_SEARCH_ON_BOUND_CHANGE = 'MAP/SEARCH_ON_BOUND_CHANGE';
export const MAP_SEARCH_ON_LEVEL_CHANGE = 'MAP/SEARCH_ON_LEVEL_CHANGE';
export const MAP_SET_MARKER_CLUSTERER = 'MAP/SET_MARKER_CLUSTERER';
export const MAP_FORCE_CLEAN_MARKER_CLUSTERER = 'MAP/FORCE_CLEAN_MARKER_CLUSTERER';

export const setMarkerClusterer = (markerClusterer) => {
    return {
        type: MAP_SET_MARKER_CLUSTERER,
        markerClusterer
    }
}
export const forceCleanMarkerClusterer = () => {
    return {
        type: MAP_FORCE_CLEAN_MARKER_CLUSTERER
    }
}
export const setMapCenter = (latlng) => {
    return {
        type: MAP_SET_MAP_CENTER,
        latlng
    }
};

export const setMapCenterForce = (latlng) => {
    return {
        type: MAP_SET_MAP_CENTER_FORCE,
        latlng
    }
};

export const setMapCenterChange = (latlng) => {
    return {
        type: MAP_SET_MAP_CENTER_CHANGE,
        latlng
    }
};

export const setMapBounds = (mapBounds, margins=null) => {
    return {
        type: MAP_SET_MAP_BOUNDS,
        mapBounds,
        mapBoundMargins: margins
    }
}

export const resetMapBounds = () => {
    return {
        type: MAP_SET_MAP_BOUNDS,
        mapBounds: null,
        mapBoundMargins: null
    }
}

export const setMapBoundChanged = ({swLat, swLng, neLat, neLng}) => {
    return {
        type: MAP_SET_MAP_BOUNDS_CHANGE,
        changedMapBounds: {
            sw: {
                lat: swLat,
                lng: swLng
            },
            ne: {
                lat: neLat,
                lng: neLng
            }
        }
    }
};

export const resetMapLevel = () => {
    return {
        type: MAP_SET_MAP_LEVEL,
        level: null
    }
}

export const setMapLevel = (level) => {
    return {
        type: MAP_SET_MAP_LEVEL,
        level
    }
}

export const resetMapCenterChange = () => {
    return {
        type: MAP_RESET_MAP_CENTER_CHANGE,
    }
};

export const loadingMapStarted = () => {
    return {
        type: MAP_LOADING_MAP_STARTED
    }
};

export const loadingMapFinished = () => {
    return {
        type: MAP_LOADING_MAP_FINISHED
    }
};

export const loadingMapSuccess = (map, mapRef, kakao) => {
    return {
        type: MAP_LOADING_MAP_SUCCESS,
        map,
        mapRef,
        kakao
    }
};

export const loadingMapFail = () => {
    return {
        type: MAP_LOADING_MAP_FAIL
    }
};

export const setGeoLocationCenter = (latlng) => {
    return {
        type: MAP_SET_GEOLOCATION_CENTER,
        latlng
    }
};

export const loadingGeoLocationStarted = () => {
    return {
        type: MAP_LOADING_GEOLOCATION_STARTED,
    }
};

export const loadingGeoLocationFinished = () => {
    return {
        type: MAP_LOADING_GEOLOCATION_FINISHED,
    }
};

export const loadingGeoLocationSuccess = () => {
    return {
        type: MAP_LOADING_GEOLOCATION_SUCCESS,
    }
};

export const loadingGeoLocationFail = () => {
    return {
        type: MAP_LOADING_GEOLOCATION_FAIL,
    }
};

export const setSearchOnBoundChange = (searchOnBoundChange) => {
    return {
        type: MAP_SEARCH_ON_BOUND_CHANGE,
        searchOnBoundChange
    }
}

export const setSearchOnLevelChange = (searchOnLevelChange) => {
    return {
        type: MAP_SEARCH_ON_LEVEL_CHANGE,
        searchOnLevelChange
    }
}