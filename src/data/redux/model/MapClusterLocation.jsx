import {chain as _chain, filter as _filter, map as _map} from "lodash";
import MapLocation from "data/redux/model/MapLocation";

class MapClusterLocation {
    markerList;
    // [{
    //     "id": 54,
    //     "tag": "#소고기 #쌀국수 #3천원",
    //     "name": "월면가",
    //     "latitude": 36.6616172852146,
    //     "longitude": 126.680217670404
    // }]
    markerListSize;
    centerLatitude;
    centerLongitude;

    constructor(data={}) {
        if (data == null) data = {};
        Object.assign(this, data);
    }

    get locationIdList() {
        return _map(this.markerList, marker => marker.id);
    }

    findLocation(id) {
        return _chain(this.markerList)
            .filter(marker => marker.id == id)
            .map(marker => new MapLocation(marker))
            .get(0)
            .value()


    }

    get locationList() {
        return _map(this.markerList, marker => new MapLocation(marker));
    }
}

export default MapClusterLocation;