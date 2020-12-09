import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faThumbsUp as fasTumbsUp, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import React, {useCallback, useEffect, useState} from "react";
import {COMMENT_LIKED, COMMENT_UNLIKED} from "assets/styles/colors";
import {useDispatch} from "react-redux";
import {requireUser} from "data/redux/action/user";
import {
    deleteMoobeCommentDeleted,
    fetchDeleteMoobeComment,
    fetchUpdateCommentLike,
    fetchUpdateMoobeComment,
    updateMoobeCommentUpdated
} from "data/redux/action/comment";
import {CommentTextArea} from "components/common/comment/CommentInput";
import {isNil as _isNil} from 'lodash'
import Moment from "react-moment";
import {DEFAULT_IMAGE} from "assets/styles/const";


const Comment = ({comment, user, isMoobe, isRawHtml}) => {
    const [isEditable, setIsEditable] = useState(_isNil(user) ? false : comment.email === user.email);
    const [liked, setLiked] = useState(isMoobe ? comment.liked : false);
    const [edit, setEdit] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [isOverflow, setIsOverflow] = useState(false);
    const [likeCount, setLikeCount] = useState(comment.likeCount);
    const [commentValue, setCommentValue] = useState(comment.comment);
    const dispatch = useDispatch();

    const updateOverflow = useCallback(node => {
        if (node) {
            let commentContent = node.getElementsByClassName("comment");
            //TODO fix ios safari client height is 0
            setIsOverflow(commentContent[0].clientHeight > 100);
        }
    }, []);

    const updateLike = () => {
        let originLike = liked;
        let updateLike = !liked;
        let originLikeCount = likeCount;
        let updateLikeCount = updateLike ? likeCount + 1 : likeCount - 1;
        dispatch(requireUser((user) => {
            setLiked(updateLike);
            setLikeCount(updateLikeCount);
            dispatch(fetchUpdateCommentLike(user.email, comment.id, comment.contentsId, updateLike, () => {
                dispatch(updateMoobeCommentUpdated(comment, {liked: updateLike, likeCount: updateLikeCount}))
            }, () => {
                setLiked(originLike);
                setLikeCount(originLikeCount);
            }))
        }))
    }

    const updateComment = (value) => {
        if (isEditable) {
            dispatch(requireUser((user) => {
                dispatch(fetchUpdateMoobeComment(user.email, comment.id, value, () => {
                    dispatch(updateMoobeCommentUpdated(comment, {comment: value}))
                    setEdit(false);
                }, () => {
                    alert("댓글 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.");
                    setEdit(false);
                }))
            }))
        }
    }

    const deleteComment = () => {
        if (isEditable && confirm("댓글을 삭제 하시겠습니까?")) {
            dispatch(requireUser((user) => {
                dispatch(fetchDeleteMoobeComment(user.email, comment.id, () => {
                    dispatch(deleteMoobeCommentDeleted(comment))
                }, () => {
                    alert("댓글 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.");
                }))
            }))
        }
    }

    const onChangeCommentInput = (e) => {
        if (edit) {
            setCommentValue(e.target.value);
        }
    }

    const onCancelCommentInput = (e) => {
        setEdit(false);
        setCommentValue(comment.comment);
    }

    const renderEditableComment = () => {
        return edit
        ? <CommentTextArea className="textarea has-fixed-size overflow-hidden is-top-borderless is-left-borderless is-right-borderless is-shadowless is-radiusless has-padding-5"
                           inputValue={commentValue}
                           onSubmit={updateComment}
                           onChange={onChangeCommentInput}
                           onCancel={onCancelCommentInput}/>
        : <div className="row">{comment.comment.split('\n').map( (line, idx) => {
                return (<span key={idx}>{line}<br/></span>)
            })}</div>
    }

    const renderComment = () => {
        return isRawHtml
        ? <div dangerouslySetInnerHTML={{__html: comment.comment}}/>
        : <div className="row">{comment.comment.split('\n').map( (line, idx) => {
                return (<span key={idx}>{line}<br/></span>)
            })}</div>
    }

    const renderActionButton = () => {
        return (
            <>
                <FontAwesomeIcon className={"clickable is-marginless has-text-weight-semibold " + (edit ? " has-text-info" : "has-text-grey-light ")}
                                 icon={faPen}
                                 size={"2x"}
                                 transform={"shrink-9"}
                                 onClick={(e) => setEdit(!edit)} />
                <FontAwesomeIcon className="clickable is-marginless has-text-grey-light has-text-weight-semibold"
                                 icon={faTrashAlt}
                                 size={"2x"}
                                 transform={"shrink-9"}
                                 onClick={deleteComment}/>

            </>
        )
    }

    const getCommentContainerClassName = () => {
        return !isOverflow
        ? "is-block"
        : showMore
            ? "is-block"
            : "is-block has-height-96 overflow-hidden"

    }
    const renderShowMoreButton = () => {
        return showMore
        ? <span className="comment-show-more-btn has-margin-top-5 has-cursor-pointer" onClick={(e) => setShowMore(false)}>간략히</span>
        : <span className="has-margin-top-5">
                ...<br/>
                <span className="comment-show-more-btn has-cursor-pointer" onClick={(e) => setShowMore(true)}>자세히 보기</span>
        </span>
    }


    return (
        <div ref={updateOverflow} className="card is-shadowless">
            <div className="card-content is-paddingless has-padding-15">
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-48x48">
                            <img className="is-rounded" src={comment.profileImage ? comment.profileImage : DEFAULT_IMAGE} alt="Placeholder image" />
                        </figure>
                    </div>
                    <div className="media-content overflow-visible">
                        <div className="row has-margin-bottom-5">
                            <span>{comment.user}</span>
                            <small className="has-padding-left-5 has-text-grey-light has-tooltip-arrow has-tooltip-info has-cursor-default has-text-weight-semibold" data-tooltip={comment.registerDate}>
                                <Moment fromNow>{comment.registerDate}</Moment>
                            </small>
                            <span className="is-pulled-right">
                                {isEditable ? renderActionButton() : null}
                            </span>

                        </div>
                        <div className={getCommentContainerClassName()}>
                            <div className="comment">
                                {isEditable ? renderEditableComment() : renderComment()}
                            </div>
                        </div>
                        {isOverflow ? renderShowMoreButton() : null}
                        <div className="row has-margin-top-5">
                                <FontAwesomeIcon icon={fasTumbsUp}
                                                 className={isMoobe ? "has-cursor-pointer" : ""}
                                                 color={liked ? COMMENT_LIKED : COMMENT_UNLIKED}
                                                 onClick={isMoobe ? updateLike : () => {}}
                                /> <small>{likeCount}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(Comment);