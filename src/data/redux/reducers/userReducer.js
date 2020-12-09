import {updateObject} from "data/util";
import {isObjectLike as _isObjectLike, isNull as _isNull, isEmpty as _isEmpty} from 'lodash';
import {USER_RESET_USER, USER_SET_USER} from "data/redux/action/user";
import MoobeUser from "data/redux/model/User";
import {LOGOUT_REDIRECT_URL} from "data/api";

const initialStateUser = {
    user: null
};

function setUser(userState, user) {
    let oldUser = userState.user;
    let newUser  = null;

    if (_isObjectLike(user)) {
        newUser = new MoobeUser(user);
    } else { //failed to get user info
        return updateObject(userState, {user: null})
    }

    if(isValidSession(oldUser, newUser)) {
        return updateObject(userState, {user: newUser})
    } else {
        alert("세션 정보가 올바르지 않습니다.!");
        return updateObject(userState, {user: null})
    }
}

function isValidSession(oldUser, newUser) {
    if (_isNull(newUser) || _isEmpty(newUser.email)) {
        return false;
    }

    if (_isNull(oldUser)) { //first login
        return true
    } else {
        if (oldUser.email === newUser.email) {//same user as before
            return true
        } else { //not same user as before. force logout
            alert("잘못된 사용자 정보 입니다.");
            window.location = LOGOUT_REDIRECT_URL;
            return false
        }
    }
}

export default function(userState = initialStateUser, action) {
    switch(action.type) {
        case USER_SET_USER: return setUser(userState, action.user);
        case USER_RESET_USER: return updateObject(userState, {user: null});
        default : return userState;
    }
}


