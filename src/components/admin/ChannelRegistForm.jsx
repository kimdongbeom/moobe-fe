import React, {useState} from 'react';
import axios from 'axios';
import {buildUrl, ifNullEmpty, updateObject} from "data/util";
import {isEmpty as _isEmpty} from "lodash";
import {InputField} from "components/admin/AdminFields";
import {useDispatch} from "react-redux";
import {fetchChannel} from "data/redux/action/channel";

const ChannelRegistForm = () => {
    const initChannelState = {
        youtubeId: '',
        youtubeName: '',
        category: '',
        profileImg: ''
    }
    const [channelLink, setChannelLink] = useState('');
    const [channelState, setChannelState] = useState(initChannelState);
    const [disableInput, setDisableInput] = useState(false);
    const dispatch = useDispatch();

    const handleChangeInput = (ev) => {
        const inputName = ev.target.name;
        setChannelState(updateObject(channelState, {[inputName]: ev.target.value}));
    }

    const checkChannelLink = (ev) => {
        if (_isEmpty(channelLink)) {
            alert("channel link가 비어있습니다.");
            return ;
        }
        setDisableInput(true)
        axios.get(buildUrl("/admin/check/channelLink?link=" + encodeURIComponent(channelLink)), {withCredentials: true})
            .then(response => {
                const data = response.data
                if (response.status == 200 && !_isEmpty(data.youtubeName)) {
                    setChannelState(updateObject(channelState, {
                        youtubeId: ifNullEmpty(data.youtubeId),
                        youtubeName: ifNullEmpty(data.youtubeName),
                        profileImg: ifNullEmpty(data.profileImg)
                    }))
                } else {
                    alert("채널 링크를 다시 확인해주세요!");
                    setChannelLink('');
                }
            }).finally(() => {
                setDisableInput(false)
        })
    }

    const addChannel = (ev) => {
        const data = new FormData(ev.target.form);
        setDisableInput(true)
        axios.post(buildUrl("/admin/regist/channel"), data, {withCredentials: true})
            .then(response => {
                if (response.data === "success") {
                    alert("정상적으로 등록되었습니다.")
                    setChannelState(initChannelState);
                } else {
                    alert("등록에 실패하였습니다.")
                }
            }).finally(() => {
                setDisableInput(false)
                dispatch(fetchChannel(null));
        });
    }

    return (
        <form>
            <div className="row">
                <div className="column is-paddingless">
                    <a disabled={disableInput} className="button is-success is-pulled-right" type="button" onClick={checkChannelLink}>채널링크확인</a>
                    <InputField disabled={disableInput} fieldName="추가할 채널 링크" name="channelLink" placeholder="ex : https://www.youtube.com/channel/UCXHt0mdmd-VIv8SuD6bhdZA" value={channelLink} onChange={(ev) => setChannelLink(ev.target.value)}/>
                </div>
                <div className="column is-paddingless">
                    <InputField disabled={disableInput} fieldName="채널 링크 ID" name="youtubeId" placeholder="채널 링크 ID" value={channelState.youtubeId} onChange={handleChangeInput}/>
                    <InputField disabled={disableInput} fieldName="채널명" name="youtubeName" placeholder="추가할 채널 이름" value={channelState.youtubeName} onChange={handleChangeInput}/>
                    <InputField disabled={disableInput} fieldName="채널 카테고리" name="category" placeholder="채널 카테고리" value={channelState.category} onChange={handleChangeInput}/>
                    <InputField disabled={disableInput} fieldName="이미지 Link" name="profileImg" placeholder="채널 프로필 이미지 주소" value={channelState.profileImg} onChange={handleChangeInput}/>
                    <button disabled={disableInput} className="button is-primary is-pulled-right" type="button" onClick={addChannel}>채널추가</button>
                </div>
            </div>
        </form>
    )
}

export default ChannelRegistForm;