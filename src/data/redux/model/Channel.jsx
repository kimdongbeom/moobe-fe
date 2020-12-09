class Channel {
    id;
    youtubeId;
    youtubeName;
    category;
    profileImg;

    constructor(data={}) {
        if (data == null) data = {};
        Object.assign(this, data);
    }
}

export default Channel;