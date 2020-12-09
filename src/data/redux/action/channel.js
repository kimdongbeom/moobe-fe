import axios from 'axios';
import {getChannels, getContents} from "data/api";

export const CHANNEL_RESET_CHANNEL_DATA = 'CHANNEL/RESET_CHANNEL_DATA';
export const CHANNEL_SET_ACTIVE_CHANNEL = 'CHANNEL/SET_ACTIVE_CHANNEL';
export const CHANNEL_FETCH_CHANNEL = 'CHANNEL/FETCH_CHANNEL';

export const CHANNEL_FETCH_CHANNEL_STARTED = 'CHANNEL/FETCH_CHANNEL_STARTED';
export const CHANNEL_FETCH_CHANNEL_FINISHED = 'CHANNEL/FETCH_CHANNEL_FINISHED';
export const CHANNEL_FETCH_CHANNEL_SUCCESS = 'CHANNEL/FETCH_CHANNEL_SUCCESS';
export const CHANNEL_FETCH_CHANNEL_ERROR = 'CHANNEL/FETCH_CHANNEL_ERROR';


export const fetchChannel = (activeChannelId) => {
    return (dispatch) => {
        dispatch(fetchChannelStarted());
        return getChannels().then(response => {
            dispatch(fetchChannelSuccess({data: response.data, activeChannelId: activeChannelId}))
        }).catch(function (error) {
            dispatch(fetchChannelFail(error))
        }).finally(() => {
            dispatch(fetchChannelFinished())
        });
    }
};

export const resetChannelData = () => {
    return {
        type: CHANNEL_RESET_CHANNEL_DATA
    }
}

export const fetchChannelStarted = () => {
    return {
        type: CHANNEL_FETCH_CHANNEL_STARTED
    }
}

export const fetchChannelFinished = () => {
    return {
        type: CHANNEL_FETCH_CHANNEL_FINISHED
    }
}

export const fetchChannelSuccess = (data) => {
    return {
        type: CHANNEL_FETCH_CHANNEL_SUCCESS,
        data: data
    }
}

export const fetchChannelFail = (err) => {
    return {
        type: CHANNEL_FETCH_CHANNEL_ERROR,
        err
    }
}

export const setActiveChannel = (channelId) => {
    return {
        type: CHANNEL_SET_ACTIVE_CHANNEL,
        channelId
    }
};

