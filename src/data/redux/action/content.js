import {getContent, getContents, searchContents, updateContentLike} from "data/api";
import {isEmpty as _isEmpty} from "lodash";
import ApiResponse from "data/redux/model/ApiResponse";

export const CONTENT_RESET_CONTENT_DATA = 'CONTENT/RESET_CONTENT_DATA';
export const CONTENT_SET_CONTENT_LOADING = 'CONTENT/SET_CONTENT_LOADING';

export const CONTENT_UPDATE_CONTENT_UPDATED = 'CONTENT/UPDATE_CONTENT_UPDATED';

export const CONTENT_FETCH_CONTENT_STARTED = 'CONTENT/FETCH_CONTENT_STARTED';
export const CONTENT_FETCH_CONTENT_FINISHED = 'CONTENT/FETCH_CONTENT_FINISHED';
export const CONTENT_FETCH_CONTENT_SUCCESS = 'CONTENT/FETCH_CONTENT_SUCCESS';
export const CONTENT_FETCH_CONTENT_ERROR = 'CONTENT/FETCH_CONTENT_ERROR';
export const CONTENT_FETCH_CONTENT_LIKE_STARTED = 'CONTENT/FETCH_CONTENT_LIKE_STARTED';
export const CONTENT_FETCH_CONTENT_LIKE_FINISHED = 'CONTENT/FETCH_CONTENT_LIKE_FINISHED';
export const CONTENT_FETCH_CONTENT_LIKE_SUCCESS = 'CONTENT/FETCH_CONTENT_LIKE_SUCCESS';
export const CONTENT_FETCH_CONTENT_LIKE_ERROR = 'CONTENT/FETCH_CONTENT_LIKE_ERROR';
export const CONTENT_SET_PAGE_NUM = 'CONTENT/SET_PAGE_NUM';

export const SEARCH_TYPE_TOTAL = "total"
export const SEARCH_TYPE_TITLE = "title"
export const SEARCH_TYPE_STORE = "store"
export const SEARCH_TYPE_TAG = "tag"
export const SEARCH_TYPE_ADDRESS = "address"
export const searchTypeList = [
    { "title": "전체", "type": SEARCH_TYPE_TOTAL },
    { "title": "주소", "type": SEARCH_TYPE_ADDRESS },
    { "title": "제목", "type": SEARCH_TYPE_TITLE },
    { "title": "가게 이름", "type": SEARCH_TYPE_STORE },
    { "title": "태그", "type": SEARCH_TYPE_TAG },
]

export const getSearchType = (searchType) => {
    return searchTypeList.find((type) => type.type == searchType);
}

export const fetchContentList = (channelId, query, searchType, mapBounds=null, pageNum=1, isAppend=false, callback=null) => {
    return (dispatch) => {
        if (!isAppend) {
            dispatch(resetContentData());
        }
        dispatch(fetchContentStarted());
        let getContentApi;
        if (_isEmpty(query)) {
            getContentApi = getContents(channelId, mapBounds, pageNum);
        } else {
            getContentApi = searchContents(query, searchType, channelId, mapBounds, pageNum);
        }
        return getContentApi.then(response => {
                dispatch(fetchContentSuccess({data: response.data, pageNum: pageNum, isAppend: isAppend}))
                dispatch(fetchContent(channelId))
            }).catch((error)  => {
                dispatch(fetchContentFail(error))
            }).finally(() => {
                dispatch(fetchContentFinished());
                if(callback) callback(channelId);
        });
    }
};

export const fetchContent = (channelId, contentId) => {
    if (!contentId) {
        return (dispatch) => {/*do Nothing*/};
    }
    return (dispatch) => {
        dispatch(fetchContentStarted());
        //TODO set active channel to get content
        return getContent(contentId, channelId).then(response => {
            dispatch(fetchContentSuccess({data: response.data, isAppend: true, isUnit: true}))
        }).catch((error)  => {
            dispatch(fetchContentFail(error))
        }).finally(() => {
            dispatch(fetchContentFinished())
        });
    }
}

export const fetchUpdateContentLike = (email, contentId, like, successCallback, failedCallback) => {
    return (dispatch) => {
        dispatch(fetchContentLikeStarted());
        return updateContentLike(email, contentId, like).then(response => {
            let apiResponse = new ApiResponse(response.data)
            if (apiResponse.isSuccess) {
                dispatch(fetchContentLikeSuccess());
                if (successCallback) successCallback();
            } else {
                dispatch(fetchContentLikeFail());
                if (failedCallback) failedCallback();
            }
        }).catch((error) => {
            dispatch(fetchContentLikeFail());
            if (failedCallback) failedCallback()
        }).finally(() => {
            dispatch(fetchContentLikeFinished());
        })
    }
};

export const resetContentData = () => {
    return {
        type: CONTENT_RESET_CONTENT_DATA
    }
};

export const setContentLoading = (contentLoading) => {
    return {
        type: CONTENT_SET_CONTENT_LOADING,
        contentLoading
    }
};

export const fetchContentStarted = () => {
    return {
        type: CONTENT_FETCH_CONTENT_STARTED
    }
};

export const fetchContentFinished = () => {
    return {
        type: CONTENT_FETCH_CONTENT_FINISHED
    }
};

export const fetchContentSuccess = (data) => {
    return {
        type: CONTENT_FETCH_CONTENT_SUCCESS,
        data
    }
};

export const fetchContentFail = (err) => {
    return {
        type: CONTENT_FETCH_CONTENT_ERROR,
        err
    }
};

export const fetchContentLikeStarted = () => {
    return {
        type: CONTENT_FETCH_CONTENT_LIKE_STARTED
    }
};

export const fetchContentLikeFinished = () => {
    return {
        type: CONTENT_FETCH_CONTENT_LIKE_FINISHED
    }
};

export const fetchContentLikeSuccess = () => {
    return {
        type: CONTENT_FETCH_CONTENT_LIKE_SUCCESS
    }
};

export const fetchContentLikeFail = (err) => {
    return {
        type: CONTENT_FETCH_CONTENT_LIKE_ERROR,
        err
    }
};

export const updateContentUpdated = (content, updatedValue) => {
    return {
        type: CONTENT_UPDATE_CONTENT_UPDATED,
        data: {
            id: content.id,
            updatedValue: updatedValue
        }
    }
}

export const setPageNum = (pageNum) => {
    return {
        type: CONTENT_SET_PAGE_NUM,
        pageNum
    }
};



