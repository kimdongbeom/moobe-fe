import {updateObject} from "data/util";
import Content from "data/redux/model/Content";
import {concat as _concat, isNil as _isNil, map as _map, toNumber as _toNumber, uniqWith as _uniqWith} from "lodash";
import {
    CONTENT_FETCH_CONTENT_FINISHED,
    CONTENT_FETCH_CONTENT_STARTED,
    CONTENT_FETCH_CONTENT_SUCCESS,
    CONTENT_RESET_CONTENT_DATA,
    CONTENT_SET_CONTENT_LOADING,
    CONTENT_UPDATE_CONTENT_UPDATED
} from "data/redux/action/content";

const initialStateContent = {
    contentList: [],
    contentLoading: false,
    pageNum: 1,
    pageSize: 1,
    totalCount: 0,
    maxPage: 0,
};

function fetchSuccess(contentState, response) {
    const {data, pageNum, isAppend, isUnit} = response;
    let contentList, contentCount = {};
    if (isUnit) {
        contentList = renderResult([data])
    } else {
        contentList = renderResult(data.contents)
        contentCount = renderCount(data.pageInfo)
    }
    let updateState = buildState(contentState, contentList, contentCount, pageNum, isAppend, isUnit);
    return updateObject(contentState, updateState)
}

function buildState(originState, contentList, contentCount, pageNum, isAppend, isUnit ) {
    return updateObject({
        contentList: !isAppend ? contentList : isUnit ? mergeContents(contentList, originState.contentList) : mergeContents(originState.contentList, contentList),
        pageNum: pageNum ? _toNumber(pageNum) : originState.pageNum
    }, contentCount)
}

function renderResult(results) {
    if (results) {
        return _map(results, (result) => new Content(result));
    } else {
        return []
    }
}

function renderCount(pageInfo) {
    if (pageInfo) {
        return {
            totalCount: pageInfo.totalCount,
            maxPage: pageInfo.totalPage,
            pageSize: pageInfo.pageSize
        }
    } else {
        return {}
    }
}

function mergeContents(originContentList, newContentList) {
    return  _uniqWith(_concat(originContentList, newContentList), isEqualsContent);
}

function isEqualsContent(content1, content2) {
    if (_isNil(content1) || _isNil(content2)) {
        return false;
    }
    return content1.id === content2.id;
}

function updateContentCount(contentState, contentCount) {
    return updateObject(contentState, {
        totalCount: contentCount.totalCount,
        maxPage: contentCount.totalPage
    })
}

const updateContent = (contentState, data) => {
    const {id, updatedValue} = data
    let updateContentList = _map(contentState.contentList, (content) => {
        if (content.id === id) {
            return new Content(updateObject(content, updatedValue));
        } else {
            return content;
        }
    });
    return updateObject(contentState, {contentList: updateContentList});
}

export default function(contentState = initialStateContent, action) {
    switch(action.type) {
        case CONTENT_RESET_CONTENT_DATA: return updateObject(contentState, {contentList: []});
        case CONTENT_SET_CONTENT_LOADING : return updateObject(contentState, {contentLoading: action.contentLoading});
        case CONTENT_UPDATE_CONTENT_UPDATED : return updateContent(contentState, action.data);
        case CONTENT_FETCH_CONTENT_STARTED : return updateObject(contentState, {contentLoading: true});
        case CONTENT_FETCH_CONTENT_FINISHED : return updateObject(contentState, {contentLoading: false});
        case CONTENT_FETCH_CONTENT_SUCCESS : return fetchSuccess(contentState, action.data);
        default : return contentState;
    }
}


