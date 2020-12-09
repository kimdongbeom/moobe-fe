import Reactotron from 'reactotron-react-js'

import {reactotronRedux} from "reactotron-redux";

const reactotron = Reactotron
        .configure() // we can use plugins here -- more on this later
        .use(reactotronRedux({
            except: [
                // 'MAP/SET_MAP_CENTER',
                // 'MAP/SET_MAP_CENTER_FORCE',
                // 'MAP/SET_MAP_CENTER_CHANGE',
                // 'MAP/SET_MAP_BOUNDS_CHANGE',
                // 'MAP/SET_MAP_LEVEL_CHANGE',
                // 'MAP/MAP_RESET_MAP_CENTER_CHANGE',
                'MAP/LOADING_MAP_STARTED',
                'MAP/LOADING_MAP_FINISHED',
                'MAP/LOADING_MAP_SUCCESS',
                'MAP/LOADING_MAP_FAIL',
                // 'MAP/SET_GEOLOCATION_CENTER',
                // 'MAP/LOADING_GEOLOCATION_STARTED',
                // 'MAP/LOADING_GEOLOCATION_FINISHED',
                // 'MAP/LOADING_GEOLOCATION_SUCCESS',
                // 'MAP/LOADING_GEOLOCATION_FAIL',
                // 'MAP/SEARCH_ON_BOUND_CHANGE',
                'MAP/SET_MARKER_CLUSTERER',
                // 'MAP/FORCE_CLEAN_MARKER_CLUSTERER',
            ]
        }))
        .connect() // let's connect!

export default reactotron;