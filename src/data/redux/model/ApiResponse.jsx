import {toNumber as _toNumber} from "lodash";

class ApiResponse {
    header;
    contents;
    pageInfo;

    constructor(data={}) {
        if (data == null) data = {};
        Object.assign(this, data);
    }

    renderContents(clazz) {
        if (clazz) {
            return this.contents.map(content => new clazz(content));
        } else {
            return [];
        }
    }

    renderContent(clazz) {
        return new clazz(this.contents);
    }

    get isSuccess() {
        if (this.header) {
            return this.resultCode === 200
        } else {
            return false
        }
    }

    get resultCode() {
        if (this.header && this.header.resultCode) {
            return _toNumber(this.header.resultCode);
        } else {
            return -1;
        }
    }

    get totalCount() {
        if(this.pageInfo) {
            return this.pageInfo.totalCount;
        } else {
            return 0
        }
    }

    get maxPage() {
        if(this.pageInfo) {
            return this.pageInfo.totalPage;
        } else {
            return 0
        }
    }

    get pageSize() {
        if(this.pageInfo) {
            return this.pageInfo.pageSize;
        } else {
            return 0
        }
    }
}

export default ApiResponse;