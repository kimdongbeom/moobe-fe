import {isNil as _isNil, split as _split} from 'lodash';

class FavoriteContent {
    content;

    constructor(data={}) {
        if (data == null) data = {};
        Object.assign(this, data);
    }

    get channelId() {
        return !_isNil(this.content)
            ? this.content.channelId
            : null
    }
}

export default FavoriteContent;