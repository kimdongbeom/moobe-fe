import {updateObject} from "data/util";
import Content from "data/redux/model/Content";
import {map as _map} from "lodash";
import {
    FAVORITE_CONTENT_FETCH_CONTENT_FINISHED,
    FAVORITE_CONTENT_FETCH_CONTENT_STARTED,
    FAVORITE_CONTENT_FETCH_CONTENT_SUCCESS,
    FAVORITE_CONTENT_RESET_CONTENT_DATA,
    FAVORITE_CONTENT_SET_CONTENT_LOADING,
} from "data/redux/action/favorite";
import FavoriteContent from "data/redux/model/FavoriteContent";

const initialStateFavoriteContent = {
    favoriteContentDetail: {},
    favoriteContentList: [],
    favoriteContentLoading: false,
    totalCount: 0,
    maxPage: 0,
};

function fetchSuccess(favoriteContentState, response) {
    const {data} = response;
    let favoriteContentList = renderResult(data)
    return updateObject(favoriteContentState, {favoriteContentList})
}

function renderResult(results) {
    if (results) {
        return _map(results, (result) => new FavoriteContent({content: new Content(result)}));
    } else {
        return []
    }
}

export default function(favoriteContentState = initialStateFavoriteContent, action) {
    switch(action.type) {
        case FAVORITE_CONTENT_RESET_CONTENT_DATA: return updateObject(favoriteContentState, initialStateFavoriteContent);
        case FAVORITE_CONTENT_SET_CONTENT_LOADING : return updateObject(favoriteContentState, {favoriteContentLoading: action.favoriteContentLoading});
        case FAVORITE_CONTENT_FETCH_CONTENT_STARTED : return updateObject(favoriteContentState, {favoriteContentLoading: true});
        case FAVORITE_CONTENT_FETCH_CONTENT_FINISHED : return updateObject(favoriteContentState, {favoriteContentLoading: false});
        case FAVORITE_CONTENT_FETCH_CONTENT_SUCCESS : return fetchSuccess(favoriteContentState, action.data);
        default : return favoriteContentState;
    }
}


