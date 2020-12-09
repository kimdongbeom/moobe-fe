import {
    CHANNEL_FETCH_CHANNEL,
    CHANNEL_FETCH_CHANNEL_SUCCESS,
    CHANNEL_FETCH_CHANNEL_ERROR,
    CHANNEL_SET_ACTIVE_CHANNEL,
    fetchChannelData,
    fetchSuccessChannelData,
    fetchErrorChannelData, CHANNEL_RESET_CHANNEL_DATA,
} from "data/redux/action/channel";
import { updateObject} from "data/util";
import Channel from "data/redux/model/Channel";
import {find as _find, map as _map, toString as _toString} from "lodash";

const initialStateChannel = {
    channelList: [],
    activeChannel: null,
    channelLoading: false
};

function fetchSuccess(channelState, response) {
    const {data, activeChannelId} = response;
    let channelList = _map(data, result => new Channel(result));
    let activeChannel = _find(channelList, (channel) => _toString(channel.id) === activeChannelId);
    return updateObject(channelState, {channelList: channelList, activeChannel: activeChannel, channelLoading: false})
}

function setActiveChannel(channelState, channelId) {
    let activeChannel = null;
    channelState.channelList.map(channel => {
        if("" + channel.id === channelId) {
            activeChannel = channel;
        }
    });

    return updateObject(channelState, {activeChannel: activeChannel})
}

export default function(channelState = initialStateChannel, action) {
    switch(action.type) {
        case CHANNEL_RESET_CHANNEL_DATA : return updateObject(channelState, initialStateChannel);
        case CHANNEL_SET_ACTIVE_CHANNEL : return setActiveChannel(channelState, action.channelId);
        case CHANNEL_FETCH_CHANNEL : return updateObject(channelState, {channelLoading: true});
        case CHANNEL_FETCH_CHANNEL_SUCCESS : return fetchSuccess(channelState, action.data);
        default : return channelState;
    }
}


