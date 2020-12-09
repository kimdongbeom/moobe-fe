import { split as _split, isEmpty as _isEmpty} from 'lodash';

class Store {
    id;
    contentsId;
    name;
    tel;
    address1;
    address2;
    availableTime;
    latitude;
    longitude;
    link;
    menu;

    constructor(data={}) {
        if (data == null) data = {};
        Object.assign(this, data)
    }
}

class ContentMetrics {
    viewCount;
    likeCount;
    dislikeCount;
    commentCount;
    updateRegisterDate;
    constructor(data={}) {
        if (data == null) data = {};
        Object.assign(this, data);
    }
}

class Content {
    id;
    videoLinkId;
    channelId;
    storeId;
    title;
    tag;
    content;
    registerDate;
    registerDateMoobe;
    thumbnailUrl;
    liked;

    store;
    metrics;

    constructor(data={}) {
        if (data == null) data = {};
        Object.assign(this, data);
        this.store = new Store(data.store);
        this.metrics = new ContentMetrics(data.contentsMetrics);
    }

    get viewCount() {
        if (_isEmpty(this.metrics)) return 0
        return this.metrics.viewCount ? this.metrics.viewCount : 0;
    }

    get likeCount() {
        if (_isEmpty(this.metrics)) return 0
        return this.metrics.likeCount ? this.metrics.likeCount : 0;
    }

    get dislikeCount() {
        if (_isEmpty(this.metrics)) return 0
        return this.metrics.dislikeCount ? this.metrics.dislikeCount : 0;
    }

    get updateRegisterDate() {
        if (_isEmpty(this.metrics)) return null
        return this.metrics.updateRegisterDate;
    }

    get tagList() {
        return _split(this.tag, "#").filter(s => s !== "");
    }
}


export default Content;