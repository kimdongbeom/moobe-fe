import {
    forEach as _forEach,
    isEmpty as _isEmpty,
    isMatch as _isMatch,
    isNil as _isNil,
    isObjectLike as _isObjectLike,
    map as _map,
    pickBy as _pickBy
} from "lodash";
import {getSearchType} from "data/redux/action/content";
import {Observable} from "rxjs";

export const nullFunction = () => {}

const CHANNEL_PATH = "channels"
const CONTENT_PATH =  "contents"

export function updateObject(oldObject, newValues) {
    return Object.assign({}, oldObject, newValues);
}

export function _insert(n, ins, arr) {
    return [...arr.slice(0, n), ins, ...arr.slice(n)];
}

export function buildKakaoMapBounds(moobeMapBounds) {
    const unpackedBounds = unpackMoobeMapBounds(moobeMapBounds);
    if (!_isNil(unpackedBounds)) {
        return [{lat: unpackedBounds.swLat, lng: unpackedBounds.swLng}, {lat: unpackedBounds.neLat, lng: unpackedBounds.neLng}];
    } else {
        return null;
    }
};

export function buildMoobeMapBounds(swLat, swLng, neLat, neLng) {
    if (_isNil(swLat) || _isNil(swLng) || _isNil(neLat) || _isNil(neLng)) {
        return null;
    }
    return {
        sw: {
            lat: swLat,
            lng: swLng
        },
        ne: {
            lat: neLat,
            lng: neLng
        }
    }
}

export function toStringMoobeMapBounds(moobeMapBounds) {
    return "((" +  moobeMapBounds.sw.lat + ", " +  moobeMapBounds.sw.lng + "), (" +  moobeMapBounds.ne.lat + ", " +  moobeMapBounds.ne.lng + "))";
}

export function unpackMoobeMapBounds(mapBounds) {
    if (_isNil(mapBounds)
        || _isNil(mapBounds.sw)
        || _isNil(mapBounds.sw.lat)
        || _isNil(mapBounds.sw.lng)
        || _isNil(mapBounds.ne)
        || _isNil(mapBounds.ne.lat)
        || _isNil(mapBounds.ne.lng)) {
        return null;
    }
    return {
        swLat: mapBounds.sw.lat,
        swLng: mapBounds.sw.lng,
        neLat: mapBounds.ne.lat,
        neLng: mapBounds.ne.lng
    }
}

export function isEqualBounds(b1, b2) {
    if (_isNil(b1) || _isNil(b2)) {
        return b1 === b2;
    }
    return (b1.sw.lat === b2.sw.lat
            && b1.sw.lng === b2.sw.lng
            && b1.ne.lat === b2.ne.lat
            && b1.ne.lng === b2.ne.lng)
}

export function buildChannelPath(channel) {
    if (_isNil(channel) || _isNil(channel.id)) {
        return '';
    } else {
        return '/' + [CHANNEL_PATH, channel.id].join("/")
    }
}

export function buildContentPath(channel, content) {
    let channelPath = buildChannelPath(channel);
    if (content !== null) {
        return [channelPath, CONTENT_PATH, content.id].join("/")
    } else {
        return _isEmpty(channelPath) ? "/" : channelPath;
    }
}

export function buildUrl(path) {
    return process.env.REACT_APP_API_URL + path;
}

export function expandUrl(path, variable, query=null) {
    _forEach(variable, (v, k) => {
        path = path.replace("{{" + k + "}}", v)
    });
    if (query) {
        return path + "?" + query;
    } else {
        return path;
    }

}

export function getSearchQueryParams(query, searchType) {
    if (!_isEmpty(query)) {
        return {query: query, searchType: getSearchType(searchType).type}
    } else {
        return {};
    }
}

export function getSearchQueryText(query, searchType) {
    if (!_isEmpty(query)) {
        let searchTypeData = getSearchType(searchType);
        return searchTypeData.title + ":" + query;
    } else {
        return "";
    }
}

export function buildQuery(values) {
    return _map(_pickBy(values, (v, k) => !_isNil(v)), (v, k) => k + "=" + v).join("&")
}

export function deepCompareSetState(state, updateState) {
    if(updateState && _isObjectLike(state)) {
        updateState((originState) => {
            if (originState && _isMatch(originState, state)) {
                return originState;
            }
            return state
        })
    }
}

export function fixedFlotingPoint(v, limit=4) {
    if (!v) return v;
    let denom = Math.pow(10, limit);
    return Math.floor(v * denom) / denom;
}

export function isSimilarLocation(latlng1, latlng2, accuracy=3) {
    if (_isNil(latlng1) || _isNil(latlng1.lat) || _isNil(latlng1.lng)
    || _isNil(latlng2) || _isNil(latlng2.lat) || _isNil(latlng2.lng)) {
        return false;
    }
    return fixedFlotingPoint(latlng1.lat, accuracy) === fixedFlotingPoint(latlng2.lat, accuracy)
        && fixedFlotingPoint(latlng1.lng, accuracy) === fixedFlotingPoint(latlng2.lng, accuracy);
}

export function delayObservable(delay) {
    return new Observable(observer => {
        setTimeout(() => {
            observer.next(delay);
            observer.complete();
        }, delay);
    });
};

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function ifNullEmpty(v) {
    return _isNil(v) ? '' : v
}
