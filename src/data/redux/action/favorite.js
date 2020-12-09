import {getFavoriteChannels, getFavoriteContents} from "data/api";

export const FAVORITE_CHANNEL_RESET_CHANNEL_DATA = 'FAVORITE_CHANNEL/RESET_CHANNEL_DATA';
export const FAVORITE_CHANNEL_SET_ACTIVE_CHANNEL = 'FAVORITE_CHANNEL/SET_ACTIVE_CHANNEL';
export const FAVORITE_CHANNEL_SET_CHANNEL_LOADING = 'FAVORITE_CHANNEL/SET_CHANNEL_LOADING';
export const FAVORITE_CHANNEL_FETCH_CHANNEL_STARTED = 'FAVORITE_CHANNEL/FETCH_CHANNEL_STARTED';
export const FAVORITE_CHANNEL_FETCH_CHANNEL_FINISHED = 'FAVORITE_CHANNEL/FETCH_CHANNEL_FINISHED';
export const FAVORITE_CHANNEL_FETCH_CHANNEL_SUCCESS = 'FAVORITE_CHANNEL/FETCH_CHANNEL_SUCCESS';
export const FAVORITE_CHANNEL_FETCH_CHANNEL_ERROR = 'FAVORITE_CHANNEL/FETCH_CHANNEL_ERROR';

export const FAVORITE_CONTENT_RESET_CONTENT_DATA = 'FAVORITE_CONTENT/RESET_CONTENT_DATA';
export const FAVORITE_CONTENT_SET_CONTENT_LOADING = 'FAVORITE_CONTENT/SET_CONTENT_LOADING';
export const FAVORITE_CONTENT_FETCH_CONTENT_STARTED = 'FAVORITE_CONTENT/FETCH_CONTENT_STARTED';
export const FAVORITE_CONTENT_FETCH_CONTENT_FINISHED = 'FAVORITE_CONTENT/FETCH_CONTENT_FINISHED';
export const FAVORITE_CONTENT_FETCH_CONTENT_SUCCESS = 'FAVORITE_CONTENT/FETCH_CONTENT_SUCCESS';
export const FAVORITE_CONTENT_FETCH_CONTENT_ERROR = 'FAVORITE_CONTENT/FETCH_CONTENT_ERROR';

export const fetchFavoriteContentList = () => {
    return (dispatch) => {
        dispatch(resetFavoriteContentData());
        dispatch(fetchFavoriteContentStarted());
        return getFavoriteContents().then(response => {
                dispatch(fetchFavoriteContentSuccess({data: response.data}))
            }).catch((error)  => {
                dispatch(fetchFavoriteContentFail(error))
            }).finally(() => {
                dispatch(fetchFavoriteContentFinished());
        });
    }
};

export const fetchFavoriteChannelList = () => {
    return (dispatch) => {
        dispatch(resetFavoriteChannelData());
        dispatch(fetchFavoriteChannelStarted());
        return getFavoriteChannels().then(response => {
            dispatch(fetchFavoriteChannelSuccess({data: response.data}));
        }).catch((error)  => {
            dispatch(fetchFavoriteChannelFail(error));
        }).finally(() => {
            dispatch(fetchFavoriteChannelFinished());
        });
    }
}

export const resetFavoriteContentData = () => {
    return {
        type: FAVORITE_CONTENT_RESET_CONTENT_DATA
    }
};

export const setFavoriteContentLoading = (favoriteContentLoading) => {
    return {
        type: FAVORITE_CONTENT_SET_CONTENT_LOADING,
        favoriteContentLoading
    }
};

export const fetchFavoriteContentStarted = () => {
    return {
        type: FAVORITE_CONTENT_FETCH_CONTENT_STARTED
    }
};

export const fetchFavoriteContentFinished = () => {
    return {
        type: FAVORITE_CONTENT_FETCH_CONTENT_FINISHED
    }
};

export const fetchFavoriteContentSuccess = (data) => {
    return {
        type: FAVORITE_CONTENT_FETCH_CONTENT_SUCCESS,
        data
    }
};

export const fetchFavoriteContentFail = (err) => {
    return {
        type: FAVORITE_CONTENT_FETCH_CONTENT_ERROR,
        err
    }
};

export const resetFavoriteChannelData = () => {
    return {
        type: FAVORITE_CHANNEL_RESET_CHANNEL_DATA
    }
};

export const setFavoriteChannelLoading = (favoriteChannelLoading) => {
    return {
        type: FAVORITE_CHANNEL_SET_CHANNEL_LOADING,
        favoriteChannelLoading
    }
};

export const fetchFavoriteChannelStarted = () => {
    return {
        type: FAVORITE_CHANNEL_FETCH_CHANNEL_STARTED
    }
};

export const fetchFavoriteChannelFinished = () => {
    return {
        type: FAVORITE_CHANNEL_FETCH_CHANNEL_FINISHED
    }
};

export const fetchFavoriteChannelSuccess = (data) => {
    return {
        type: FAVORITE_CHANNEL_FETCH_CHANNEL_SUCCESS,
        data
    }
};

export const fetchFavoriteChannelFail = (err) => {
    return {
        type: FAVORITE_CHANNEL_FETCH_CHANNEL_ERROR,
        err
    }
};



