import {
    COMMENT_ADD_MOOBE_COMMENT_FIRST, COMMENT_DELETE_MOOBE_COMMENT_DELETED,
    COMMENT_FETCH_MOOBE_FINISHED,
    COMMENT_FETCH_MOOBE_STARTED,
    COMMENT_FETCH_MOOBE_SUCCESS,
    COMMENT_FETCH_YOUTUBE_FINISHED,
    COMMENT_FETCH_YOUTUBE_STARTED,
    COMMENT_FETCH_YOUTUBE_SUCCESS,
    COMMENT_RESET_COMMENT, COMMENT_UPDATE_MOOBE_COMMENT_UPDATED
} from "data/redux/action/comment";
import {
    concat as _concat,
    filter as _filter,
    map as _map
} from "lodash";
import {updateObject} from "data/util";
import Comment from "data/redux/model/Comment";

const initialStateComment = {
    videoId: null,
    moobeCommentList: [],
    moobeCommentPageNum: 0,
    moobeCommentMaxPage: 0,
    moobeCommentTotalCount: 0,
    moobeCommentLoading: false,
    youtubeCommentList: [],
    youtubeCommentPageNum: 0,
    youtubeCommentMaxPage: 0,
    youtubeCommentTotalCount: 0,
    youtubeCommentLoading: false
};

const fetchSuccessYoutubeComment = (commentState, response) => {
    const {apiResponse, page} = response;
    let commentList = apiResponse.renderContents(Comment);
    return updateObject(commentState, {
        youtubeCommentLoading: false,
        youtubeCommentList: commentState.youtubeCommentList.concat(commentList),
        youtubeCommentPageNum: page,
        youtubeCommentMaxPage: apiResponse.maxPage,
        youtubeCommentTotalCount: apiResponse.totalCount,
    })
};

const fetchSuccessMoobeComment = (commentState, response) => {
    const {apiResponse, page} = response;
    let commentList = apiResponse.renderContents(Comment);
    return updateObject(commentState, {
        moobeCommentLoading: false,
        moobeCommentList: commentState.moobeCommentList.concat(commentList),
        moobeCommentPageNum: page,
        moobeCommentMaxPage: apiResponse.maxPage,
        moobeCommentTotalCount: apiResponse.totalCount,
    })
};

const updateMoobeComment = (commentState, data) => {
    const {id, updatedValue} = data
    let updateCommentList = _map(commentState.moobeCommentList, (comment) => {
        if (comment.id === id) {
            return new Comment(updateObject(comment, updatedValue));
        } else {
            return comment;
        }
    });
    return updateObject(commentState, {moobeCommentList: updateCommentList});
}

export default function(commentState = initialStateComment, action) {
    switch (action.type) {
        case COMMENT_RESET_COMMENT: return updateObject(commentState, initialStateComment);
        case COMMENT_ADD_MOOBE_COMMENT_FIRST: return updateObject(commentState, {moobeCommentList: _concat([action.data], commentState.moobeCommentList), moobeCommentTotalCount: commentState.moobeCommentTotalCount + 1});
        case COMMENT_UPDATE_MOOBE_COMMENT_UPDATED: return updateMoobeComment(commentState, action.data);
        case COMMENT_DELETE_MOOBE_COMMENT_DELETED: return updateObject(commentState, {moobeCommentList: _filter(commentState.moobeCommentList, (comment) => comment.id !== action.data.id), moobeCommentTotalCount: commentState.moobeCommentTotalCount - 1});
        case COMMENT_FETCH_YOUTUBE_STARTED: return updateObject(commentState, {youtubeCommentLoading: true});
        case COMMENT_FETCH_YOUTUBE_SUCCESS: return fetchSuccessYoutubeComment(commentState, action.data);
        case COMMENT_FETCH_YOUTUBE_FINISHED: return updateObject(commentState, {youtubeCommentLoading: false});
        case COMMENT_FETCH_MOOBE_STARTED: return updateObject(commentState, {moobeCommentLoading: true});
        case COMMENT_FETCH_MOOBE_SUCCESS: return fetchSuccessMoobeComment(commentState, action.data);
        case COMMENT_FETCH_MOOBE_FINISHED: return updateObject(commentState, {moobeCommentLoading: false});
        default : return commentState;
    }
}