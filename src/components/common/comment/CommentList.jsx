import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import VisibilitySensor from "react-visibility-sensor";
import {isEmpty as _isEmpty, isNil as _isNil} from "lodash";
import {fetchMoobeComment, fetchYoutubeComment, resetComment} from "data/redux/action/comment";
import Comment from "components/common/comment/Comment";
import {LoadingBouncer} from "components/common/layout/PresentUtil";
import CommentInput from "components/common/comment/CommentInput";
import {COMMENT_LOADING} from "assets/styles/colors";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGrinStars, faGrinTears} from "@fortawesome/free-regular-svg-icons";

const CommentList = ({content}) => {
    const [activeMoobeComment, setActiveMoobeComment] = useState(false);
    const {moobeCommentList, moobeCommentPageNum, moobeCommentMaxPage, moobeCommentTotalCount,  moobeCommentLoading,
        youtubeCommentList, youtubeCommentPageNum, youtubeCommentMaxPage, youtubeCommentTotalCount, youtubeCommentLoading} = useSelector(state => state.comment);
    const {user} = useSelector(state => state.user);
    const getComment = () => activeMoobeComment ? moobeCommentList : youtubeCommentList;
    const getCommentLoading = () => activeMoobeComment ? moobeCommentLoading : youtubeCommentLoading;
    const dispatch = useDispatch();

    useEffect(() => {
        if (!_isEmpty(content)) {
            initComment();
        }
        return () => {
            dispatch(resetComment());
        }
    }, [content]);

    const initComment = () => {
        dispatch(fetchMoobeComment(content.id, 1, moobeCommentMaxPage, true));
        dispatch(fetchYoutubeComment(content.id, 1, youtubeCommentMaxPage, true));
    }

    const fetchComment = (page = 1, reset = false) => {
        if (!_isNil(content) && !getCommentLoading()) {
            dispatch(activeMoobeComment
                ? fetchMoobeComment(content.id, page, moobeCommentMaxPage)
                : fetchYoutubeComment(content.id, page, youtubeCommentMaxPage))
        }
    };

    const onVisibleFooter = (visible) => {
        if (visible) {
            let currentCommentPage = activeMoobeComment ? moobeCommentPageNum : youtubeCommentPageNum
            fetchComment(currentCommentPage + 1)
        }
    }

    const renderComments = () => {
        return getComment().map(comment => <Comment key={comment.uuid} comment={comment} user={user} isMoobe={activeMoobeComment} isRawHtml={!activeMoobeComment} />)
    }

    const renderCommentFooter = () => {
        let comments = getComment();
        let isMaxPage = activeMoobeComment
            ? moobeCommentPageNum >= moobeCommentMaxPage
            : youtubeCommentPageNum >= youtubeCommentMaxPage
        if (getCommentLoading()) {
          return null;
        } else if (_isEmpty(comments)) {
            return activeMoobeComment ? <MoobeCommentEmpty /> : <YoutubeCommentEmpty videoId={content.videoLinkId}/>
        } else if (isMaxPage) {
            return activeMoobeComment ? <MoobeCommentFooter /> : <YoutubeCommentFooter videoId={content.videoLinkId}/>
        }
    }

    const renderStaticTab = () => (
        <div className="column tabs is-toggle is-fullwidth is-marginless is-top-paddingless white-space-normal">
            {!activeMoobeComment ? <p className="fa-0-87x has-text-grey ">유튜브 댓글 중 좋아요 기준 TOP 10 댓글만 제공합니다</p> : <p>&nbsp;</p>}
            <strong className="is-size-5 has-padding-right-5">댓글 {activeMoobeComment ? moobeCommentTotalCount : youtubeCommentTotalCount}개</strong>
            <ul>
                <li className={activeMoobeComment? "": "is-active"}><a onClick={() => setActiveMoobeComment(false)}><strong>Youtube</strong></a></li>
                <li className={activeMoobeComment? "is-active" : ""}><a onClick={() => setActiveMoobeComment(true)}><strong>Moobe</strong></a></li>
            </ul>
        </div>
    );

    return (
        <>
            <div className="column is-full has-border-top-width-1 is-paddingless">
                {renderStaticTab()}
                <div>
                    {activeMoobeComment ? <CommentInput /> : null}
                    {renderComments()}
                    {renderCommentFooter()}
                </div>
            </div>
            <VisibilitySensor onChange={onVisibleFooter}>
                <div className="has-min-height-100 has-margin-bottom-25 has-text-centered">
                    <LoadingBouncer color={COMMENT_LOADING} loading={getCommentLoading()} />
                </div>
            </VisibilitySensor>
        </>
    )
};

const MoobeCommentEmpty = () => (
    <div className="has-text-centered has-text-grey-light has-text-weight-semibold">
        <p><FontAwesomeIcon icon={faGrinTears} size={"2x"}/></p>
        <p>등록된 댓글이 없어요...</p>
        <p>첫번째 댓글의 주인공이 되어 보세요!</p>
    </div>
)

const MoobeCommentFooter = () => (
    <div className="has-text-centered has-text-grey-light has-text-weight-semibold">
        <p><FontAwesomeIcon icon={faGrinStars} size={"2x"}/></p>
        <p>더이상 댓글이 없어요...</p>
        <p>센스 있는 댓글 달아주세요...</p>
    </div>
)

const YoutubeCommentEmpty = ({videoId}) => (
    <div className="has-text-centered has-text-grey-light has-text-weight-semibold">
        <p><FontAwesomeIcon icon={faGrinTears} size={"2x"}/></p>
        <p>댓글을 못가져 왔나봐요... 미안해요...</p>
        <p className="has-padding-top-15"><a className="button is-primary" href={"https://www.youtube.com/watch?v=" + videoId} target="_blank">Youtube에서 보기</a></p>
    </div>
)


const YoutubeCommentFooter = ({videoId}) => (
    <div className="has-text-centered has-text-grey-light has-text-weight-semibold">
        <p><FontAwesomeIcon icon={faGrinStars} size={"2x"}/></p>
        <p>Youtube에서 더 많은 댓글을 확인하세요!</p>
        <p className="has-padding-top-15"><a className="button is-primary" href={"https://www.youtube.com/watch?v=" + videoId} target="_blank">Youtube에서 보기</a></p>
    </div>
)



export default React.memo(CommentList);