import { combineReducers } from 'redux';
import channelReducer from "data/redux/reducers/channelReducer";
import contentReducer from "data/redux/reducers/contentReducer";
import mapReducer from "data/redux/reducers/mapReducer";
import commentReducer from "data/redux/reducers/commentReducer";
import userReducer from "data/redux/reducers/userReducer";
import favoriteContentReducer from "data/redux/reducers/favoriteContentReducer";
import favoriteChannelReducer from "data/redux/reducers/favoriteChannelReducer";
import contentDetailReducer from "data/redux/reducers/contentDetailReducer";
import mapLocationReducer from "data/redux/reducers/mapLocationReducer";
import mapClusterLocationReducer from "data/redux/reducers/mapClusterLocationReducer";

export default combineReducers({
    channel: channelReducer,
    content: contentReducer,
    contentDetail: contentDetailReducer,
    favoriteContent: favoriteContentReducer,
    favoriteChannel: favoriteChannelReducer,
    map: mapReducer,
    mapLocation: mapLocationReducer,
    mapClusterLocation: mapClusterLocationReducer,
    comment: commentReducer,
    user: userReducer,
})