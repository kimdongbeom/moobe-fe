import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'data/redux/reducers';
import checkLoginMiddleware from "data/redux/middleware/loginCheck";
import checkAdminMiddleware from "data/redux/middleware/adminCheck";
import Reactotron from 'components/dev/ReactotronConfig'
Reactotron.clear();

let middleware = compose(applyMiddleware(checkLoginMiddleware, checkAdminMiddleware, thunk))
if (process.env.REACT_APP_ENV !== 'real') {
    // let composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
    // middleware = composeEnhancers(applyMiddleware(checkLoginMiddleware, checkAdminMiddleware, thunk))
    middleware = compose(applyMiddleware(checkLoginMiddleware, checkAdminMiddleware, thunk), Reactotron.createEnhancer()) //reactotron
}
const store = createStore(rootReducer, middleware);
export default store;