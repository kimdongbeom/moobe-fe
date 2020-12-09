import {updateObject} from "data/util";
import {map as _map} from "lodash";
import {
    LOCATION_FETCH_LOCATION_ERROR,
    LOCATION_FETCH_LOCATION_FINISHED,
    LOCATION_FETCH_LOCATION_STARTED,
    LOCATION_FETCH_LOCATION_SUCCESS,
    LOCATION_RESET_LOCATION_DATA, LOCATION_RESET_LOCATION_LIST, LOCATION_SET_FOCUSED_LOCATION
} from "data/redux/action/location";
import MapLocation from "data/redux/model/MapLocation";

const initialMapLocationState = {
    mapLocationList: [],
    mapLocationLoading: false,
    focusedMapLocation: null
};

function fetchSuccess(mapLocationState, response) {
    const {data} = response;
    let mapLocationList = _map(data, result => new MapLocation(result));
    return updateObject(mapLocationState, {mapLocationList: mapLocationList})
}

export default function(mapLocationState = initialMapLocationState, action) {
    switch(action.type) {
        case LOCATION_RESET_LOCATION_DATA : return updateObject(mapLocationState, initialMapLocationState);
        case LOCATION_RESET_LOCATION_LIST : return updateObject(mapLocationState, {mapLocationList: []});
        case LOCATION_FETCH_LOCATION_STARTED : return updateObject(mapLocationState, {mapLocationLoading: true});
        case LOCATION_FETCH_LOCATION_SUCCESS : return fetchSuccess(mapLocationState, action.data);
        case LOCATION_FETCH_LOCATION_FINISHED : return updateObject(mapLocationState, {mapLocationLoading: false});
        case LOCATION_FETCH_LOCATION_ERROR : return updateObject(mapLocationState, {mapLocationLoading: false});
        case LOCATION_SET_FOCUSED_LOCATION : return updateObject(mapLocationState, {focusedMapLocation: action.data});
        default : return mapLocationState;
    }
}


