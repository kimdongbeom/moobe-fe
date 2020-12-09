import axios from "axios";
import {buildQuery, buildUrl, expandUrl, unpackMoobeMapBounds, updateObject} from "data/util";
import {isNil as _isNil} from 'lodash';
import {SEARCH_TYPE_STORE, SEARCH_TYPE_TAG, SEARCH_TYPE_TITLE, SEARCH_TYPE_ADDRESS} from "data/redux/action/content";

export const LOGIN_REDIRECT_URL = buildUrl("/login");
export const LOGOUT_REDIRECT_URL = buildUrl("/logout");

const ADMIN_URL = buildUrl("/admin/authorize");

const USER_URL = buildUrl("/api/session");
const CHANNELS_URL = buildUrl("/api/channels");
const CONTENTS_URL = buildUrl("/api/contents");
const CONTENTS_RANGE_URL = buildUrl("/api/contents/range");
const CONTENT_URL = buildUrl("/api/contents/{{contentId}}");
const CONTENT_LIKE_URL = buildUrl("/api/contents/like");
const CONTENT_UNLIKE_URL = buildUrl("/api/contents/like/cancel");

const FAVORITE_CHANNELS_URL = buildUrl("/api/favorites/channels");
const FAVORITE_CONTENTS_URL = buildUrl("/api/favorites/contents");
const FAVORITE_CONTENTS_CHANNEL_URL = buildUrl("/api/favorites/channels/{{channelId}}/contents");
const CONTENT_SEARCH_URL = buildUrl("/api/search");
const CONTENT_SEARCH_CONTENT_TITLE_URL = buildUrl("/api/search/contents/title");
const CONTENT_SEARCH_STORE_TITLE_URL = buildUrl("/api/search/store/title");
const CONTENT_SEARCH_TAG_URL = buildUrl("/api/search/tag");
const CONTENT_SEARCH_ADDRESS_URL = buildUrl("/api/search/address");

const COMMENT_MOOBE_URL = buildUrl("/api/{{contentId}}/comments/moobe");
const COMMENT_YOUTUBE_URL = buildUrl("/api/{{contentId}}/comments/youtube");
const COMMENT_LIKE_URL = buildUrl("/api/comment/like");
const COMMENT_UNLIKE_URL = buildUrl("/api/comment/like/cancel");

const COMMENT_INSERT_URL = buildUrl("/api/comment/insert");
const COMMENT_UPDATE_URL = buildUrl("/api/comment/modify");
const COMMENT_DELETE_URL = buildUrl("/api/comment/delete");

const LOCATIONS_URL = buildUrl("/api/contents/locations");
const LOCATIONS_RANGE_URL = buildUrl("/api/contents/range/locations");

const CLUSTER_LOCATIONS_URL = buildUrl("/api/cluster");

//api
export const getChannels = () => {
    return axios.get(CHANNELS_URL);
}

export const getFavoriteChannels = () => {
    return axios.get(FAVORITE_CHANNELS_URL, {withCredentials: true});
}

export const getContents = (channel=null, mapBounds=null, page=null) => {
    if (_isNil(mapBounds)) {
        let query = buildQuery(Object.assign({channel, page}));
        return axios.get(expandUrl(CONTENTS_URL, {}, query), {withCredentials: true});
    } else {
        let body = Object.assign(_isNil(channel) ? {} : {channelId: channel}, {pageNum: page}, unpackMoobeMapBounds(mapBounds));
        return axios.post(CONTENTS_RANGE_URL, body, {withCredentials: true});
    }
};

export const searchContents = (query, searchType, channel=null, mapBounds=null, page=null) => {
    let searchQuery = buildQuery({query})
    let url = getSearchUrl(searchType)
    let body = Object.assign(_isNil(channel) ? {} : {channelId: channel}, {pageNum: page}, unpackMoobeMapBounds(mapBounds));
    return axios.post(expandUrl(url, {}, searchQuery), body, {withCredentials: true});
};

const getSearchUrl = (searchType) => {
    switch(searchType) {
        case SEARCH_TYPE_TITLE: return CONTENT_SEARCH_CONTENT_TITLE_URL;
        case SEARCH_TYPE_STORE: return CONTENT_SEARCH_STORE_TITLE_URL;
        case SEARCH_TYPE_TAG: return CONTENT_SEARCH_TAG_URL;
        case SEARCH_TYPE_ADDRESS: return CONTENT_SEARCH_ADDRESS_URL;
        default : return CONTENT_SEARCH_URL;
    }
}

export const getContent = (contentId, channel=null) => {
    let query = buildQuery({channel});
    return axios.get(expandUrl(CONTENT_URL, {contentId}, query), {withCredentials: true});
};

export const getContentLocations = (channel=null, mapBounds=null) => {
    if (_isNil(mapBounds)) {
        let query = buildQuery({channel});
        return axios.get(expandUrl(LOCATIONS_URL, {}, query));
    } else {
        let body = Object.assign(_isNil(channel) ? {} : {channelId: channel}, unpackMoobeMapBounds(mapBounds));
        return axios.post(LOCATIONS_RANGE_URL, body);
    }
};

export const searchContentLocations = (query, searchType, channel=null, mapBounds=null) => {
    let searchTypeFlag = getLocationSearchType(searchType)
    let queryDict = Object.assign({query}, {flag: searchTypeFlag})
    if (_isNil(mapBounds)) {
        let query = buildQuery(Object.assign({channel}, queryDict))
        return axios.get(expandUrl(LOCATIONS_URL, {}, query))
    } else {
        let query = buildQuery(queryDict)
        let body = Object.assign(_isNil(channel) ? {} : {channelId: channel}, unpackMoobeMapBounds(mapBounds));
        return axios.post(expandUrl(LOCATIONS_RANGE_URL, {}, query), body, {withCredentials: true});
    }
};

export const getClusterLocations = (channel = null, mapLevel= null, mapBounds=null) => {
    let query;
    if (!_isNil(mapBounds)) {
        query = buildQuery(Object.assign({channel, level: mapLevel}, unpackMoobeMapBounds(mapBounds)));
    } else {
        query = buildQuery({channel, level: mapLevel});
    }
    return axios.get(expandUrl(CLUSTER_LOCATIONS_URL, {}, query));
}

const getLocationSearchType = (searchType) => {
    switch(searchType) {
        case SEARCH_TYPE_ADDRESS: return 5;
        case SEARCH_TYPE_TAG: return 4;
        case SEARCH_TYPE_TITLE: return 3;
        case SEARCH_TYPE_STORE: return 2;
        default : return 1;
    }
}

export const getFavoriteContents = (channel=null) => {
    if (_isNil(channel)) {
        return axios.get(FAVORITE_CONTENTS_URL, {withCredentials: true});
    } else {
        return axios.get(expandUrl(FAVORITE_CONTENTS_CHANNEL_URL, {channelId: channel}), {withCredentials: true});
    }
}

export const getMoobeComment = (contentId, page) => {
    let query = buildQuery({page});
    return axios.get(expandUrl(COMMENT_MOOBE_URL, {contentId}, query),{withCredentials: true});
};

export const getYoutubeComment = (contentId, page) => {
    let query = buildQuery({page});
    return axios.get(expandUrl(COMMENT_YOUTUBE_URL, {contentId}, query), {withCredentials: true});
};

export const getUser = () => axios.get(USER_URL,{withCredentials: true});
export const checkAdmin = () => axios.get(ADMIN_URL, {withCredentials: true});

export const updateContentLike = (email, contentId, like) => {
    let body = {
        id: contentId,
        email: email
    };
    if (like) {
        return axios.post(CONTENT_LIKE_URL, body, {withCredentials: true});
    } else {
        return axios.post(CONTENT_UNLIKE_URL, body, {withCredentials: true});
    }
};

export const updateCommentLike = (email, commentId, contentsId, like) => {
    let body = {
        id: commentId,
        email: email,
        contentsId: contentsId
    };
    if (like) {
        return axios.post(COMMENT_LIKE_URL, body, {withCredentials: true});
    } else {
        return axios.post(COMMENT_UNLIKE_URL, body, {withCredentials: true});
    }
};

export const insertComment = (email, contentId, value) => {
    let body = {
        email: email,
        contentsId: contentId,
        comment: value,
        likeCount: 0
    }
    return axios.post(COMMENT_INSERT_URL, body, {withCredentials: true});

}

export const updateComment = (email, commentId, value) => {
    let body = {
        id: commentId,
        email: email,
        comment: value,
    }
    return axios.post(COMMENT_UPDATE_URL, body, {withCredentials: true});
}

export const deleteComment = (email, commentId) => {
    let body = {
        id: commentId,
        email: email
    }
    return axios.post(COMMENT_DELETE_URL, body, {withCredentials: true});

}