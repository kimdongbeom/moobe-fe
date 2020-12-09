import React from 'react';
import { Route } from 'react-router';
import { concat as _concat } from 'lodash';
import {contentDetailPagePaths, contentListPagePaths, favoritePagePaths} from "./data/router-util";

export default (
    <Route>
        {_concat(contentListPagePaths, contentDetailPagePaths, favoritePagePaths).map(p => <Route key={p} exact path={p} /> )}
    </Route>
);