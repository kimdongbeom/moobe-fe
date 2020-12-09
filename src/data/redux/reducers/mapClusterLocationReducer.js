import {updateObject} from "data/util";
import {concat as _concat, map as _map} from "lodash";
import {
    CLUSTER_LOCATION_FETCH_LOCATION_ERROR,
    CLUSTER_LOCATION_FETCH_LOCATION_FINISHED,
    CLUSTER_LOCATION_FETCH_LOCATION_STARTED,
    CLUSTER_LOCATION_FETCH_LOCATION_SUCCESS,
    CLUSTER_LOCATION_RESET_LOCATION_DATA
} from "data/redux/action/clusterLocation";
import MapClusterLocation from "data/redux/model/MapClusterLocation";
import MapLocation from "data/redux/model/MapLocation";

const initialMapClusterLocationState = {
    mapClusterLocationList: [],
    mapClusterLocationLoading: false,
    mapClusterLocationMarkerList: [],
    mapClusterLocationMarkerSize: 0

};

function fetchSuccess(mapClusterLocationState, response) {
    const {data} = response;
    let mapClusterLocationList = _map(data, result => new MapClusterLocation(result));
    let mapClusterLocationMarkerList = _map(mapClusterLocationList, cluster => cluster.markerList).reduce((a, b) => _concat(a, b), []).map(m => new MapLocation(m))
    let mapClusterLocationMarkerSize = mapClusterLocationMarkerList.length
    return updateObject(mapClusterLocationState, {mapClusterLocationList, mapClusterLocationMarkerList, mapClusterLocationMarkerSize})
}

export default function(mapClusterLocationState = initialMapClusterLocationState, action) {
    switch(action.type) {
        case CLUSTER_LOCATION_RESET_LOCATION_DATA : return updateObject(mapClusterLocationState, initialMapClusterLocationState);
        case CLUSTER_LOCATION_FETCH_LOCATION_STARTED : return updateObject(mapClusterLocationState, {mapClusterLocationLoading: true});
        case CLUSTER_LOCATION_FETCH_LOCATION_SUCCESS : return fetchSuccess(mapClusterLocationState, action.data);
        case CLUSTER_LOCATION_FETCH_LOCATION_FINISHED : return updateObject(mapClusterLocationState, {mapClusterLocationLoading: false});
        case CLUSTER_LOCATION_FETCH_LOCATION_ERROR : return updateObject(mapClusterLocationState, {mapClusterLocationLoading: false});
        default : return mapClusterLocationState;
    }
}


