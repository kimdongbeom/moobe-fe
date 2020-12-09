import React from 'react';
import ReactDOM from 'react-dom';
import {Router} from "react-router";
import {LastLocationProvider} from 'react-router-last-location';
import {Provider} from 'react-redux';
import {createBrowserHistory} from 'history';
import {CookiesProvider} from "react-cookie";

import 'assets/sass/moobe.scss';
import * as serviceWorker from 'serviceWorker';
import App from "components/App";
import store from "data/redux/store";
import 'moment/locale/ko';
import 'moment-timezone';
import Moment from 'react-moment';
Moment.globalTimezone = 'Asia/Seoul';

import 'clearTimeout';

ReactDOM.render(
    <CookiesProvider>
        <Provider store={store}>
            <Router history={createBrowserHistory()}>
                <LastLocationProvider>
                    <App />
                </LastLocationProvider>
            </Router>
        </Provider>
    </CookiesProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
