import {isNull as _isNull} from "lodash";
import {fetchUser} from "data/redux/action/user";
import {LOGIN_REDIRECT_URL} from "data/api";

const checkLoginMiddleware = store => next => action => {
    if (!action.checkLogin) {
        return next(action)
    }
    return fetchUser()(store.dispatch, store.getState)
        .then(r => {
            if (_isNull(store.getState().user.user)) {
                if(action.before) {
                    action.before()
                }
                if (confirm("로그인이 필요한 기능입니다. 로그인 하시겠습니까?")) {
                    window.location = LOGIN_REDIRECT_URL;
                } else {
                    if(action.fail) {
                        action.fail()
                    }
                }
            } else {
                if(action.success) {
                    action.success(store.getState().user.user)
                }
            }
        });
};

export default checkLoginMiddleware;