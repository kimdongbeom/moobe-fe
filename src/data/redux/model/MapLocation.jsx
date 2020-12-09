import Content from "data/redux/model/Content";
import {split as _split} from "lodash";

class MapLocation {
    id;
    name;
    latitude;
    longitude;
    tag;

    constructor(data={}) {
        if (data == null) data = {};
        if (data instanceof Content) {
            this.id = data.id
            this.name = data.store.name
            this.latitude = data.store.latitude
            this.longitude = data.store.longitude
            this.tag = data.tag
        } else {
            Object.assign(this, data);
        }
    }

    get tagList() {
        return _split(this.tag, "#").filter(s => s !== "");
    }
}

export default MapLocation;