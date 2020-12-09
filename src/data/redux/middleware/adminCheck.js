import {isNull as _isNull} from "lodash";
import {fetchUser} from "data/redux/action/user";
import {checkAdmin, LOGIN_REDIRECT_URL} from "data/api";

const checkAdminMiddleware = store => next => action => {
    if (!action.checkAdmin) {
        return next(action)
    }
    return checkAdmin()
        .then(r => {
            if (!_isNull(r) && !_isNull(r.data) && r.data === true) {
                if(action.success) {
                    action.success()
                }
            } else {
                if(action.before) {
                    action.before()
                }
                if(action.fail) {
                    action.fail()
                }

            }
        });
};

export default checkAdminMiddleware;