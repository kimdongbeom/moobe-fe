class MoobeUser {
    id;
    email;
    nickname;
    imageUrl;
    social;
    role;
    point;

    constructor(data={}) {
        if (data == null) data = {};
        Object.assign(this, data);
    }
}

export default MoobeUser;