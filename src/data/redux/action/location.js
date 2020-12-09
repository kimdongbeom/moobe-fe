import {getContentLocations, searchContentLocations} from "data/api";
import {isEmpty as _isEmpty} from "lodash";

export const LOCATION_RESET_LOCATION_DATA = 'LOCATION/RESET_LOCATION_DATA';
export const LOCATION_RESET_LOCATION_LIST = 'LOCATION/RESET_LOCATION_LIST';
export const LOCATION_FETCH_LOCATION_STARTED = 'LOCATION/FETCH_LOCATION_STARTED';
export const LOCATION_FETCH_LOCATION_FINISHED = 'LOCATION/FETCH_LOCATION_FINISHED';
export const LOCATION_FETCH_LOCATION_SUCCESS = 'LOCATION/FETCH_LOCATION_SUCCESS';
export const LOCATION_FETCH_LOCATION_ERROR = 'LOCATION/FETCH_LOCATION_ERROR';
export const LOCATION_SET_FOCUSED_LOCATION = 'LOCATION/SET_FOCUSED_LOCATION';


export const fetchLocation = (channel=null, query=null, searchType=null, mapBounds=null) => {
    return (dispatch) => {
        dispatch(fetchLocationStarted());
        let getLocationApi;
        if (_isEmpty(query)) {
            getLocationApi = getContentLocations(channel, mapBounds);
        } else {
            getLocationApi = searchContentLocations(query, searchType, channel, mapBounds);
        }
        return getLocationApi.then(response => {
            dispatch(fetchLocationSuccess({data: response.data}))
        }).catch(function (error) {
            dispatch(fetchLocationFail(error))
        }).finally(() => {
            dispatch(fetchLocationFinished())
        });
    }
};

export const setFocusedLocation = (mapLocation) => {
    return {
        type: LOCATION_SET_FOCUSED_LOCATION,
        data: mapLocation
    }
}

export const resetLocationData = () => {
    return {
        type: LOCATION_RESET_LOCATION_DATA
    }
}

export const resetLocationList = () => {
    return {
        type: LOCATION_RESET_LOCATION_LIST
    }
}

export const fetchLocationStarted = () => {
    return {
        type: LOCATION_FETCH_LOCATION_STARTED
    }
}

export const fetchLocationFinished = () => {
    return {
        type: LOCATION_FETCH_LOCATION_FINISHED
    }
}

export const fetchLocationSuccess = (data) => {
    return {
        type: LOCATION_FETCH_LOCATION_SUCCESS,
        data: data
    }
}

export const fetchLocationFail = (err) => {
    return {
        type: LOCATION_FETCH_LOCATION_ERROR,
        err
    }
}
