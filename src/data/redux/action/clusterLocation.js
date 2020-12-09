import {getClusterLocations} from "data/api";

export const CLUSTER_LOCATION_RESET_LOCATION_DATA = 'CLUSTER_LOCATION/RESET_LOCATION_DATA';
export const CLUSTER_LOCATION_FETCH_LOCATION_STARTED = 'CLUSTER_LOCATION/FETCH_LOCATION_STARTED';
export const CLUSTER_LOCATION_FETCH_LOCATION_FINISHED = 'CLUSTER_LOCATION/FETCH_LOCATION_FINISHED';
export const CLUSTER_LOCATION_FETCH_LOCATION_SUCCESS = 'CLUSTER_LOCATION/FETCH_LOCATION_SUCCESS';
export const CLUSTER_LOCATION_FETCH_LOCATION_ERROR = 'CLUSTER_LOCATION/FETCH_LOCATION_ERROR';


export const fetchClusterLocation = (channel=null, mapLevel=null, mapBound=null) => {
    return (dispatch) => {
        dispatch(fetchClusterLocationStarted());
        return getClusterLocations(channel, mapLevel, mapBound).then(response => {
            dispatch(fetchClusterLocationSuccess({data: response.data}))
        }).catch(function (error) {
            dispatch(fetchClusterLocationFail(error))
        }).finally(() => {
            dispatch(fetchClusterLocationFinished())
        });
    }
};

export const resetClusterLocationData = () => {
    return {
        type: CLUSTER_LOCATION_RESET_LOCATION_DATA
    }
}

export const fetchClusterLocationStarted = () => {
    return {
        type: CLUSTER_LOCATION_FETCH_LOCATION_STARTED
    }
}

export const fetchClusterLocationFinished = () => {
    return {
        type: CLUSTER_LOCATION_FETCH_LOCATION_FINISHED
    }
}

export const fetchClusterLocationSuccess = (data) => {
    return {
        type: CLUSTER_LOCATION_FETCH_LOCATION_SUCCESS,
        data: data
    }
}

export const fetchClusterLocationFail = (err) => {
    return {
        type: CLUSTER_LOCATION_FETCH_LOCATION_ERROR,
        err
    }
}
