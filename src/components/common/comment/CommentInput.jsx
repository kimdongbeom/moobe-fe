import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {requireUser} from "data/redux/action/user";
import {addMoobeCommentFirst, fetchInsertMoobeComment} from "data/redux/action/comment";
import {nullFunction} from "data/util";
import {isNil as _isNil} from 'lodash';
import {DEFAULT_IMAGE} from "assets/styles/const";

const CommentInput = () => {
    const {user} = useSelector(state => state.user)
    const {contentDetail} = useSelector(state => state.contentDetail);
    const [initialValue, setInitialValue] = useState("");
    const dispatch = useDispatch();
    const [forceUpdated, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    const onFocusComment = (e) => {
        let target = e.target
        dispatch(requireUser(() => {
            target.focus();
        }, () => {
            target.blur();
        }, () => {
            target.blur();
        }))
    };

    const onSubmitComment = (value) => {
        dispatch(requireUser((user) => {
            dispatch(fetchInsertMoobeComment(user.email, contentDetail.id, value, (inserted) => {
                inserted.nickname = user.nickname;
                inserted.imageUrl = user.imageUrl;
                dispatch(addMoobeCommentFirst(inserted));
                setInitialValue("");
            }))
        }, () => {
            alert("로그인 정보가 없습니다. 다시 로그인 해주세요.");
            window.location.reload();
        }))
    }

    return (
        <div className="card is-shadowless">
            <div className="card-content is-paddingless has-padding-15">
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-48x48">
                            <img className="is-rounded" src={!_isNil(user) ? user.imageUrl: DEFAULT_IMAGE} alt="Placeholder image" />
                        </figure>
                    </div>
                    <div className="media-content">
                        <CommentTextArea className="textarea has-fixed-size overflow-hidden is-top-borderless is-left-borderless is-right-borderless is-shadowless is-radiusless has-padding-5"
                                         key={forceUpdated}
                                         inputValue={initialValue}
                                         onCancel={() => setInitialValue("")}
                                         onChange={(e) => setInitialValue(e.target.value)}
                                         onFocus={onFocusComment}
                                         onSubmit={onSubmitComment}/>

                    </div>
                </div>
            </div>
        </div>
    )
};

export const CommentTextArea = ({inputValue="", onChange=nullFunction, onFocus=nullFunction, onSubmit=nullFunction, onCancel=nullFunction, className=""}) => {
    const [textAreaRow, setTextAreaRow] = useState(1);

    const [inputValueNewLine, setInputValueNewLine] = useState(0); //input value의 new line만큼 textarea의 row를 조절
    const [textAreaRowHeight, setTextAreaRowHeight] = useState(0); // textarea의 초기 height를 기록.
    const [textAreaOverflowRow, setTextAreaOverflowRow] = useState(0); //textarea의 scroll이 발생할때 row를 조절
    const [showButton, setShowButton] = useState(false);
    const [disableButton, setDisableButton] = useState(true); //input value가 비어있을때 댓글 submit을 할 수 없도록 disable

    const textAreaRef = useRef(null);
    useEffect( () => {
        // textarea가 로드될때 초기 clientheight를 저장
        if (textAreaRef.current) {
            setTextAreaRowHeight(textAreaRef.current.clientHeight);
        }
    }, [textAreaRef]);

    useEffect(() => {
        //input value가 변경되거나 textAreaRowHeight가 변경될 때 row를 변경.
        if (inputValue === "") {
            setDisableButton(true);
            setShowButton(false);
            setTextAreaOverflowRow(0);
        } else {
            setDisableButton(false);
            setShowButton(true);
        }
        if (textAreaRef && textAreaRowHeight && textAreaRef.current.scrollHeight > textAreaRef.current.clientHeight) {
            setTextAreaOverflowRow(textAreaOverflowRow + Math.ceil((textAreaRef.current.scrollHeight - textAreaRef.current.clientHeight) / textAreaRowHeight));
        }
        setInputValueNewLine(inputValue.split("\n").length);
    }, [inputValue, textAreaRowHeight]);

    useEffect(() => {
        //inputValueNewLine와 textAreaOverflowRow가 변경 될 때마다 실제로 textarea의 row를 변경
        setTextAreaRow(inputValueNewLine + textAreaOverflowRow);
    }, [inputValueNewLine, textAreaOverflowRow])

    const cancelComment = () => {
        setShowButton(false);
        onCancel();
    };

    const submitComment = (e) => {
        onSubmit(inputValue)
    };

    const CommentActionButton = () => (
        <div className="field is-grouped is-pulled-right has-padding-top-10">
            <div className="control">
                <button className="button is-light" onClick={cancelComment}>취소</button>
            </div>
            <div className="control">
                <button className="button is-link" disabled={disableButton} onClick={submitComment}>댓글</button>
            </div>
        </div>
    );

    return (
        <>
            <textarea className={className}
                      ref={textAreaRef}
                      value={inputValue}
                      rows={textAreaRow}
                      onFocus={onFocus}
                      onChange={onChange}
                      wrap="virtual"
                      placeholder="공개 댓글 추가..."/>
            {showButton ? <CommentActionButton /> : null}
        </>
    )
}

export default CommentInput;