import uuid from "react-uuid";

class Comment {
    id;
    email;
    nickname; //moobe
    imageUrl; //moobe
    register; //youtube
    registerProfileImageUrl; //youtube
    comment;
    contentsId;
    likeCount;
    registerDate;
    modifiedDate;
    liked;
    uuid;

    constructor(data={}) {
        if (data == null) data = {};
        Object.assign(this, data);
        this.uuid = uuid();
    }

    get user() {
        if (this.nickname) {
            return this.nickname;
        } else if (this.register) {
            return this.register;
        } else {
            return this.email;
        }
    }

    get profileImage() {
        if (this.imageUrl) {
            return this.imageUrl;
        } else if (this.registerProfileImageUrl) {
            return this.registerProfileImageUrl;
        } else {
            return null;
        }
    }
}

export default Comment;