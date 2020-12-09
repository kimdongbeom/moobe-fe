import {updateObject} from "data/util";
import {map as _map} from "lodash";
import {
    FAVORITE_CHANNEL_FETCH_CHANNEL_FINISHED,
    FAVORITE_CHANNEL_FETCH_CHANNEL_STARTED,
    FAVORITE_CHANNEL_FETCH_CHANNEL_SUCCESS,
    FAVORITE_CHANNEL_RESET_CHANNEL_DATA,
    FAVORITE_CHANNEL_SET_CHANNEL_LOADING
} from "data/redux/action/favorite";
import Channel from "data/redux/model/Channel";

const initialStateFavoriteChannel = {
    activeFavoriteChannel: null,
    favoriteChannelList: [],
    favoriteChannelLoading: false,
};

function fetchSuccess(favoriteChannel, response) {
    const {data} = response;
    let favoriteChannelList = renderResult(data)
    return updateObject(favoriteChannel, {favoriteChannelList})
}

function renderResult(results) {
    if (results) {
        return _map(results, (result) => new Channel(result));
    } else {
        return []
    }
}

export default function(favoriteChannelState = initialStateFavoriteChannel, action) {
    switch(action.type) {
        case FAVORITE_CHANNEL_RESET_CHANNEL_DATA: return updateObject(favoriteChannelState, initialStateFavoriteChannel);
        case FAVORITE_CHANNEL_SET_CHANNEL_LOADING : return updateObject(favoriteChannelState, {favoriteChannelLoading: action.favoriteChannelLoading});
        case FAVORITE_CHANNEL_FETCH_CHANNEL_STARTED : return updateObject(favoriteChannelState, {favoriteChannelLoading: true});
        case FAVORITE_CHANNEL_FETCH_CHANNEL_FINISHED : return updateObject(favoriteChannelState, {favoriteChannelLoading: false});
        case FAVORITE_CHANNEL_FETCH_CHANNEL_SUCCESS : return fetchSuccess(favoriteChannelState, action.data);
        default : return favoriteChannelState;
    }
}


