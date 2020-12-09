import {
    deleteComment,
    getContents,
    getMoobeComment,
    getYoutubeComment,
    insertComment,
    updateComment,
    updateCommentLike
} from "data/api";
import ApiResponse from "data/redux/model/ApiResponse";
import Comment from "data/redux/model/Comment";


export const COMMENT_RESET_COMMENT = 'COMMENT/RESET_COMMENT';
export const COMMENT_ADD_MOOBE_COMMENT_FIRST = 'COMMENT/ADD_MOOBE_COMMENT_FIRST';
export const COMMENT_UPDATE_MOOBE_COMMENT_UPDATED = 'COMMENT/UPDATE_MOOBE_COMMENT_UPDATED';
export const COMMENT_DELETE_MOOBE_COMMENT_DELETED = 'COMMENT/DELETE_MOOBE_COMMENT_DELETED';

export const COMMENT_FETCH_MOOBE_STARTED = 'COMMENT/FETCH_MOOBE_STARTED';
export const COMMENT_FETCH_MOOBE_FINISHED = 'COMMENT/FETCH_MOOBE_FINISHED';
export const COMMENT_FETCH_MOOBE_SUCCESS = 'COMMENT/FETCH_MOOBE_SUCCESS';
export const COMMENT_FETCH_MOOBE_FAIL = 'COMMENT/FETCH_MOOBE_FAIL';

export const COMMENT_FETCH_YOUTUBE_STARTED = 'COMMENT/FETCH_YOUTUBE_STARTED';
export const COMMENT_FETCH_YOUTUBE_FINISHED = 'COMMENT/FETCH_YOUTUBE_FINISHED';
export const COMMENT_FETCH_YOUTUBE_SUCCESS = 'COMMENT/FETCH_YOUTUBE_SUCCESS';
export const COMMENT_FETCH_YOUTUBE_FAIL = 'COMMENT/FETCH_YOUTUBE_FAIL';

export const COMMENT_FETCH_COMMENT_LIKE_STARTED = 'COMMENT/FETCH_COMMENT_LIKE_STARTED';
export const COMMENT_FETCH_COMMENT_LIKE_FINISHED = 'COMMENT/FETCH_COMMENT_LIKE_FINISHED';
export const COMMENT_FETCH_COMMENT_LIKE_SUCCESS = 'COMMENT/FETCH_COMMENT_LIKE_SUCCESS';
export const COMMENT_FETCH_COMMENT_LIKE_FAIL = 'COMMENT/FETCH_COMMENT_LIKE_FAIL';

export const COMMENT_FETCH_COMMENT_INSERT_STARTED = 'COMMENT/FETCH_COMMENT_INSERT_STARTED';
export const COMMENT_FETCH_COMMENT_INSERT_FINISHED = 'COMMENT/FETCH_COMMENT_INSERT_FINISHED';
export const COMMENT_FETCH_COMMENT_INSERT_SUCCESS = 'COMMENT/FETCH_COMMENT_INSERT_SUCCESS';
export const COMMENT_FETCH_COMMENT_INSERT_FAIL = 'COMMENT/FETCH_COMMENT_INSERT_FAIL';

export const COMMENT_FETCH_COMMENT_UPDATE_STARTED = 'COMMENT/FETCH_COMMENT_UPDATE_STARTED';
export const COMMENT_FETCH_COMMENT_UPDATE_FINISHED = 'COMMENT/FETCH_COMMENT_UPDATE_FINISHED';
export const COMMENT_FETCH_COMMENT_UPDATE_SUCCESS = 'COMMENT/FETCH_COMMENT_UPDATE_SUCCESS';
export const COMMENT_FETCH_COMMENT_UPDATE_FAIL = 'COMMENT/FETCH_COMMENT_UPDATE_FAIL';

export const COMMENT_FETCH_COMMENT_DELETE_STARTED = 'COMMENT/FETCH_COMMENT_DELETE_STARTED';
export const COMMENT_FETCH_COMMENT_DELETE_FINISHED = 'COMMENT/FETCH_COMMENT_DELETE_FINISHED';
export const COMMENT_FETCH_COMMENT_DELETE_SUCCESS = 'COMMENT/FETCH_COMMENT_DELETE_SUCCESS';
export const COMMENT_FETCH_COMMENT_DELETE_FAIL = 'COMMENT/FETCH_COMMENT_DELETE_FAIL';

export const fetchYoutubeComment = (contentId, commentPage, commentMaxPage = 0, init = false) => {
    if (!init && commentPage > commentMaxPage) {
        return (dispatch) => {/*do Nothing*/};
    }
    return (dispatch) => {
        dispatch(fetchYoutubeCommentStarted())
        //TODO get comment from api
        return getYoutubeComment(contentId, commentPage).then(response => {
            dispatch(fetchYoutubeCommentSuccess({apiResponse: new ApiResponse(response.data), page: commentPage}))
        }).catch(function (error) {
            dispatch(fetchYoutubeCommentFail(error))
        }).finally(() => {
            dispatch(fetchYoutubeCommentFinished())
        })
    }
};

export const fetchMoobeComment = (contentId, commentPage, commentMaxPage = 0, init = false) => {
    if (!init && commentPage > commentMaxPage) {
        return (dispatch) => {/*do Nothing*/
        };
    }
    return (dispatch) => {
        dispatch(fetchMoobeCommentStarted());
        //TODO get comment from api
        return getMoobeComment(contentId, commentPage).then(response => {
            dispatch(fetchMoobeCommentSuccess({apiResponse: new ApiResponse(response.data), page: commentPage}))
        }).catch(function (error) {
            dispatch(fetchMoobeCommentDataFail(error))
        }).finally(() => {
            dispatch(fetchMoobeCommentFinished())
        })
    }
};

export const fetchUpdateCommentLike = (email, commentId, contentsId, like, successCallback, failedCallback) => {
    return (dispatch) => {
        dispatch(fetchCommentLikeStarted());
        return updateCommentLike(email, commentId, contentsId, like).then(response => {
            let apiResponse = new ApiResponse(response.data)
            if (apiResponse.isSuccess) {
                dispatch(fetchCommentLikeSuccess());
                if (successCallback) successCallback();
            } else {
                dispatch(fetchCommentLikeFail());
                if (failedCallback) failedCallback();
            }
        }).catch((error) => {
            dispatch(fetchCommentLikeFail());
            if (failedCallback) failedCallback();
        }).finally(() => {
            dispatch(fetchCommentLikeFinished());
        })
    }
};

export const fetchInsertMoobeComment = (email, contentId, value, successCallback=null, failedCallback=null) => {
    return (dispatch) => {
        dispatch(fetchCommentInsertStarted());
        return insertComment(email, contentId, value).then(response => {
            let apiResponse = new ApiResponse(response.data)
            if (apiResponse.isSuccess) {
                dispatch(fetchCommentInsertSuccess());
                if (successCallback) successCallback(apiResponse.renderContent(Comment));
            } else {
                dispatch(fetchCommentInsertFail());
                if (failedCallback) failedCallback();
            }
        }).catch((error) => {
            dispatch(fetchCommentInsertFail());
            if (failedCallback) failedCallback();
        }).finally(() => {
            dispatch(fetchCommentInsertFinished());
        })
    }
}


export const fetchUpdateMoobeComment = (email, commentId, value, successCallback=null, failedCallback=null) => {
    return (dispatch) => {
        dispatch(fetchCommentUpdateStarted());
        return updateComment(email, commentId, value).then(response => {
            let apiResponse = new ApiResponse(response.data)
            if (apiResponse.isSuccess) {
                dispatch(fetchCommentUpdateSuccess());
                if (successCallback) successCallback();
            } else {
                dispatch(fetchCommentUpdateFail());
                if (failedCallback) failedCallback();
            }
        }).catch((error) => {
            dispatch(fetchCommentUpdateFail());
            if (failedCallback) failedCallback();
        }).finally(() => {
            dispatch(fetchCommentUpdateFinished());
        })
    }
}

export const fetchDeleteMoobeComment = (email, commentId, successCallback=null, failedCallback=null) => {
    return (dispatch) => {
        dispatch(fetchCommentDeleteStarted());
        return deleteComment(email, commentId).then(response => {
            let apiResponse = new ApiResponse(response.data)
            if (apiResponse.isSuccess) {
                dispatch(fetchCommentDeleteSuccess());
                if (successCallback) successCallback();
            } else {
                dispatch(fetchCommentDeleteFail());
                if (failedCallback) failedCallback();
            }
        }).catch((error) => {
            dispatch(fetchCommentDeleteFail());
            if (failedCallback) failedCallback();
        }).finally(() => {
            dispatch(fetchCommentDeleteFinished());
        })
    }
}

export const resetComment = () => {
    return {
        type: COMMENT_RESET_COMMENT
    }
};

export const addMoobeCommentFirst = (comment) => {
    return {
        type: COMMENT_ADD_MOOBE_COMMENT_FIRST,
        data: comment
    }
}

export const updateMoobeCommentUpdated = (comment, updatedValue) => {
    return {
        type: COMMENT_UPDATE_MOOBE_COMMENT_UPDATED,
        data: {
            id: comment.id,
            updatedValue: updatedValue
        }
    }
}

export const deleteMoobeCommentDeleted = (comment) => {
    return {
        type: COMMENT_DELETE_MOOBE_COMMENT_DELETED,
        data: comment
    }
}

export const fetchMoobeCommentStarted = () => {
    return {
        type: COMMENT_FETCH_MOOBE_STARTED
    }
};

export const fetchMoobeCommentFinished = () => {
    return {
        type: COMMENT_FETCH_MOOBE_FINISHED
    }
};

export const fetchMoobeCommentSuccess = (data) => {
    return {
        type: COMMENT_FETCH_MOOBE_SUCCESS,
        data
    }
};

export const fetchMoobeCommentDataFail = (err) => {
    return {
        type: COMMENT_FETCH_MOOBE_FAIL,
        err
    }
};

export const fetchYoutubeCommentStarted = () => {
    return {
        type: COMMENT_FETCH_YOUTUBE_STARTED
    }
};

export const fetchYoutubeCommentFinished = () => {
    return {
        type: COMMENT_FETCH_YOUTUBE_FINISHED
    }
};

export const fetchYoutubeCommentSuccess = (data) => {
    return {
        type: COMMENT_FETCH_YOUTUBE_SUCCESS,
        data
    }
};

export const fetchYoutubeCommentFail = (err) => {
    return {
        type: COMMENT_FETCH_YOUTUBE_FAIL,
        err
    }
};

export const fetchCommentLikeStarted = () => {
    return {
        type: COMMENT_FETCH_COMMENT_LIKE_STARTED
    }
};

export const fetchCommentLikeFinished = () => {
    return {
        type: COMMENT_FETCH_COMMENT_LIKE_FINISHED
    }
};
export const fetchCommentLikeSuccess = () => {
    return {
        type: COMMENT_FETCH_COMMENT_LIKE_SUCCESS
    }
};
export const fetchCommentLikeFail = () => {
    return {
        type: COMMENT_FETCH_COMMENT_LIKE_FAIL
    }
};

export const fetchCommentInsertStarted = () => {
    return {
        type: COMMENT_FETCH_COMMENT_INSERT_STARTED
    }
};

export const fetchCommentInsertFinished = () => {
    return {
        type: COMMENT_FETCH_COMMENT_INSERT_FINISHED
    }
};
export const fetchCommentInsertSuccess = () => {
    return {
        type: COMMENT_FETCH_COMMENT_INSERT_SUCCESS
    }
};
export const fetchCommentInsertFail = () => {
    return {
        type: COMMENT_FETCH_COMMENT_INSERT_FAIL
    }
};

export const fetchCommentUpdateStarted = () => {
    return {
        type: COMMENT_FETCH_COMMENT_UPDATE_STARTED
    }
};

export const fetchCommentUpdateFinished = () => {
    return {
        type: COMMENT_FETCH_COMMENT_UPDATE_FINISHED
    }
};
export const fetchCommentUpdateSuccess = () => {
    return {
        type: COMMENT_FETCH_COMMENT_UPDATE_SUCCESS
    }
};
export const fetchCommentUpdateFail = () => {
    return {
        type: COMMENT_FETCH_COMMENT_UPDATE_FAIL
    }
};

export const fetchCommentDeleteStarted = () => {
    return {
        type: COMMENT_FETCH_COMMENT_DELETE_STARTED
    }
};

export const fetchCommentDeleteFinished = () => {
    return {
        type: COMMENT_FETCH_COMMENT_DELETE_FINISHED
    }
};
export const fetchCommentDeleteSuccess = () => {
    return {
        type: COMMENT_FETCH_COMMENT_DELETE_SUCCESS
    }
};
export const fetchCommentDeleteFail = () => {
    return {
        type: COMMENT_FETCH_COMMENT_DELETE_FAIL
    }
};

