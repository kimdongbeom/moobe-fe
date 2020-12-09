import {getContent, getContents, searchContents, updateContentLike} from "data/api";
import {isEmpty as _isEmpty} from "lodash";
import ApiResponse from "data/redux/model/ApiResponse";

export const CONTENT_DETAIL_RESET_CONTENT_DATA = 'CONTENT_DETAIL/RESET_CONTENT_DATA';
export const CONTENT_DETAIL_SET_CONTENT_LOADING = 'CONTENT_DETAIL/SET_CONTENT_LOADING';
export const CONTENT_DETAIL_SET_SHOW_OVERLAY_CONTENT_DETAIL = 'CONTENT_DETAIL/SET_SHOW_OVERLAY_CONTENT_DETAIL';
export const CONTENT_DETAIL_FETCH_CONTENT_STARTED = 'CONTENT_DETAIL/FETCH_CONTENT_STARTED';
export const CONTENT_DETAIL_FETCH_CONTENT_FINISHED = 'CONTENT_DETAIL/FETCH_CONTENT_FINISHED';
export const CONTENT_DETAIL_FETCH_CONTENT_SUCCESS = 'CONTENT_DETAIL/FETCH_CONTENT_SUCCESS';
export const CONTENT_DETAIL_FETCH_CONTENT_ERROR = 'CONTENT_DETAIL/FETCH_CONTENT_ERROR';
export const CONTENT_DETAIL_UPDATE_CONTENT_UPDATED = 'CONTENT_DETAIL/UPDATE_CONTENT_UPDATED';

export const fetchContentDetail = (channelId, contentId) => {
    if (!contentId) {
        return (dispatch) => {/*do Nothing*/};
    }
    return (dispatch) => {
        dispatch(fetchContentDetailStarted());
        //TODO set active channel to get content
        return getContent(contentId, channelId).then(response => {
            dispatch(fetchContentDetailSuccess({data: response.data}))
        }).catch((error)  => {
            dispatch(fetchContentDetailFail(error))
        }).finally(() => {
            dispatch(fetchContentDetailFinished())
        });
    }
}

export const resetContentDetailData = () => {
    return {
        type: CONTENT_DETAIL_RESET_CONTENT_DATA
    }
};

export const setContentDetailLoading = (contentDetailLoading) => {
    return {
        type: CONTENT_DETAIL_SET_CONTENT_LOADING,
        contentDetailLoading
    }
};

export const setShowOverlayContentDetail = (showOverlayContentDetail) => {
    return {
        type: CONTENT_DETAIL_SET_SHOW_OVERLAY_CONTENT_DETAIL,
        showOverlayContentDetail
    }
}

export const fetchContentDetailStarted = () => {
    return {
        type: CONTENT_DETAIL_FETCH_CONTENT_STARTED
    }
};

export const fetchContentDetailFinished = () => {
    return {
        type: CONTENT_DETAIL_FETCH_CONTENT_FINISHED
    }
};

export const fetchContentDetailSuccess = (data) => {
    return {
        type: CONTENT_DETAIL_FETCH_CONTENT_SUCCESS,
        data
    }
};

export const fetchContentDetailFail = (err) => {
    return {
        type: CONTENT_DETAIL_FETCH_CONTENT_ERROR,
        err
    }
};

export const updateContentDetail = (data) => {
    return {
        type: CONTENT_DETAIL_UPDATE_CONTENT_UPDATED,
        data
    }
}
