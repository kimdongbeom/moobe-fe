import axios from "axios";
import {getUser} from "data/api";

export const USER_SET_USER = 'USER/USER_SET_USER';
export const USER_RESET_USER = 'USER/USER_RESET_USER';

export const authorizeUser = (successCallback, failedCallback, beforeCallback = null) => {
    return {
        checkAdmin: true,
        success: successCallback,
        fail: failedCallback,
        before: beforeCallback
    }
};

export const requireUser = (successCallback, failedCallback, beforeCallback = null) => {
    return {
        checkLogin: true,
        success: successCallback,
        fail: failedCallback,
        before: beforeCallback
    }
};

export const fetchUser = () => {
    return (dispatch) => {
        return getUser().then(response => {
                dispatch(setUser(response.data))
            }).catch(function (error) {
                dispatch(resetUser());
            });
    }
};

export const setUser = (user) => {
    return {
        type: USER_SET_USER,
        user
    }
};

export const resetUser = () => {
    return {
        type: USER_RESET_USER
    }
};