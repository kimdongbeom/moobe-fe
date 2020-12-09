import {updateObject} from "data/util";
import Content from "data/redux/model/Content";
import {
    CONTENT_DETAIL_FETCH_CONTENT_FINISHED,
    CONTENT_DETAIL_FETCH_CONTENT_STARTED,
    CONTENT_DETAIL_FETCH_CONTENT_SUCCESS,
    CONTENT_DETAIL_RESET_CONTENT_DATA,
    CONTENT_DETAIL_SET_CONTENT_LOADING,
    CONTENT_DETAIL_SET_SHOW_OVERLAY_CONTENT_DETAIL,
    CONTENT_DETAIL_UPDATE_CONTENT_UPDATED
} from "data/redux/action/contentDetail";

const initialStateContentDetail = {
    contentDetail: {},
    showOverlayContentDetail: false,
    contentDetailLoading: false
};

function fetchSuccess(contentDetailState, response) {
    return updateObject(contentDetailState, {contentDetail: new Content(response.data), showOverlayContentDetail: true})
}

function updateContentDetail(contentDetailState, data) {
    return updateObject(contentDetailState, {contentDetail : updateObject(contentDetailState.contentDetail, data)})
}

export default function(contentDetailState = initialStateContentDetail, action) {
    switch(action.type) {
        case CONTENT_DETAIL_RESET_CONTENT_DATA: return updateObject(contentDetailState, {contentDetail: {}});
        case CONTENT_DETAIL_SET_CONTENT_LOADING : return updateObject(contentDetailState, {contentDetailLoading: action.contentDetailLoading});
        case CONTENT_DETAIL_SET_SHOW_OVERLAY_CONTENT_DETAIL : return updateObject(contentDetailState, {showOverlayContentDetail: action.showOverlayContentDetail});
        case CONTENT_DETAIL_FETCH_CONTENT_STARTED : return updateObject(contentDetailState, {contentDetailLoading: true});
        case CONTENT_DETAIL_FETCH_CONTENT_FINISHED : return updateObject(contentDetailState, {contentDetailLoading: false});
        case CONTENT_DETAIL_FETCH_CONTENT_SUCCESS : return fetchSuccess(contentDetailState, action.data);
        case CONTENT_DETAIL_UPDATE_CONTENT_UPDATED : return updateContentDetail(contentDetailState, action.data);
        default : return contentDetailState;
    }
}


