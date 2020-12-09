import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useDispatch, useSelector} from "react-redux";
import {authorizeUser, requireUser} from "data/redux/action/user";
import {buildUrl, ifNullEmpty, updateObject} from "data/util";
import {useHistory} from "react-router";
import {isEmpty as _isEmpty, isNil as _isNil} from "lodash";
import {fetchChannel} from "data/redux/action/channel";
import ChannelRegistForm from "components/admin/ChannelRegistForm";
import {InputField, SelectField} from "components/admin/AdminFields";

const MetaRegistForm = () => {
    const initialState = {
        youtubeName: '',
        youtubeContentsLink: '',
        contentsTitle: '',
        registerDate: '',
        tag: '',
        store: '',
        storeName: '',
        tel: '',
        address1: '',
        address2: '',
        link: '',
        latitude: '',
        longitude: '',
        availableTime: ''
        // menu: 'menu'
    }
    const [state, setState] = useState(initialState);
    const [resultText, setResultText] = useState("");
    const [puppetInfo, setPuppetInfo] = useState({server: null, youtubeLink: null, rawContent: null, loading: false});
    const [disableInput, setDisableInput] = useState(false);
    const {user} = useSelector(state => state.user)
    const {channelList} = useSelector(state => state.channel);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch(authorizeUser(() => {
            dispatch(requireUser())
            dispatch(fetchChannel())
        },() => history.replace("/")));
    }, []);

    const handleChangeInput = (ev) => {
        const inputName = ev.target.name;
        setState(updateObject(state, {[inputName]: ev.target.value}));
    }

    async function getYoutubeMeta(ev) {
        const serverUrl = puppetInfo.server
        const youtubeLink = puppetInfo.youtubeLink
        if (serverUrl && youtubeLink) {
            setPuppetInfo(updateObject(puppetInfo, {loading: true}));
            const vId = youtubeLink.split("v=")[1].split("&")[0];
            axios.get(`${serverUrl}/youtube?v=${vId}`).then(r => {
                setState(updateObject(state, {youtubeContentsLink: youtubeLink}))
                const data = r.data
                setState(updateObject(state,{
                    youtubeContentsLink: ifNullEmpty(youtubeLink),
                    contentsTitle: ifNullEmpty(data.title),
                    registerDate: filterDateText(ifNullEmpty(data.date)),
                    tag: ifNullEmpty(data.tag),
                }));
                setPuppetInfo(updateObject(puppetInfo, {
                    rawContent: ifNullEmpty(data.content)
                }))
                console.log(r.data);
            }).catch(e => alert(e))
            .finally(() => setPuppetInfo(updateObject(puppetInfo, {loading: false})));
        } else {
            alert("server url or youtube link not exist")
        }
    }

    const handleClick = (ev) => {
        const storeName = state.store;
        setDisableInput(true)
        axios.get(buildUrl("/admin/getStore?store=" + storeName), {withCredentials: true})
            .then(response => {
                const data = response.data;
                console.log(data)
                if (_isEmpty(data)) {
                    alert("주소 확인 실패");
                } else {
                    setState(updateObject(state,{
                        storeName: ifNullEmpty(data.name),
                        tel: ifNullEmpty(data.tel),
                        address1: ifNullEmpty(data.address1),
                        address2: ifNullEmpty(data.address2),
                        link: ifNullEmpty(data.link),
                        latitude: ifNullEmpty(data.latitude),
                        longitude: ifNullEmpty(data.longitude),
                        availableTime: ifNullEmpty(data.availableTime)
                    }));
                }
            }).finally(() => {
                setDisableInput(false);
            });
        ev.stopPropagation();
    }

    const modifyLink = (ev) => {
        const storeName = state.storeName;
        const storeLink = state.link;

        if (_isEmpty(storeName) || _isEmpty(storeLink)) {
            alert("storeName이나 storeLink가 없습니다. storeName " + storeName + " storeLink " + storeLink)
            return
        }
        console.log(encodeURI(storeLink))
        setDisableInput(true)
        axios.get(buildUrl("/admin/getStoreByLink?store=" + storeName + "&link=" + encodeURIComponent(storeLink)), {withCredentials: true})
            .then(response => {
                const data = response.data;
                console.log(data)
                if (_isEmpty(data)) {
                    alert("주소 확인 실패");
                } else {
                    setState(updateObject(state,{
                        storeName: ifNullEmpty(data.name),
                        tel: ifNullEmpty(data.tel),
                        address1: ifNullEmpty(data.address1),
                        address2: ifNullEmpty(data.address2),
                        link: ifNullEmpty(data.link),
                        latitude: ifNullEmpty(data.latitude),
                        longitude: ifNullEmpty(data.longitude),
                        availableTime: ifNullEmpty(data.availableTime)
                    }));
                }
            }).finally(() => {
            setDisableInput(false);
        });
        ev.stopPropagation();
    }

    const handleSubmit = (ev) => {
        ev.preventDefault();
        const data = new FormData(ev.target.form);
        for (let key of data.keys()) {
            console.log(key,": ", data.get(key));
        }
        if (_isEmpty(state.youtubeName)) {
            alert("채널을 선택해 주세요")
            return ;
        }
        setDisableInput(true)
        axios.post(buildUrl("/admin/contentsForm"), data, {withCredentials: true})
            .then(response => {
                if (response.data === "success") {
                    alert("정상적으로 등록되었습니다.")
                    setState(updateObject(initialState, {youtubeName: state.youtubeName}));
                } else {
                    alert("등록에 실패하였습니다.")
                }
            }).finally(() => {
                setDisableInput(false)
            });
    }

    const handleDateText = (ev) => {
        const inputName = ev.target.name;
        setState(updateObject(state, {[inputName]: filterDateText(ev.target.value)}));
    }

    const filterDateText = (v) => {
        let value = v
        if (value.indexOf("•") !== -1) {
            value = value.split("•")[1]
        }
        if (value.indexOf(":") !== -1) {
            value = value.split(":")[1]
        }
        return value.trim()
    }

    const modifyLocation = (address) => {
        setDisableInput(true)
        axios.get(buildUrl("/admin/getLocation?address=" + address), {withCredentials: true})
            .then(response => {
                const data = response.data;
                console.log(data)
                if (_isEmpty(data)) {
                    alert("주소 확인 실패");
                } else {
                    setState(updateObject(state,{
                        latitude: ifNullEmpty(data.latitude),
                        longitude: ifNullEmpty(data.longitude),
                    }));
                }
            }).finally(() => {
                setDisableInput(false);
            });
    }

    const handleClearCache = (text) => {
        setResultText(text)
        axios.get(buildUrl("/init/all/cache"), {withCredentials: true})
            .then(response => {
                if (response.status == 200) {
                    setResultText(text + " 성공")
                } else {
                    setResultText(text + " 실패 : " + response.status)
                }
            })
            .catch(e => {
                setResultText(text + " 실패 : " + e)
            });
    }

    return (
        <>

            {_isNil(user)
            ? null
            : <>
                <div className="columns">
                    <div className="column">
                        <ChannelRegistForm />
                    </div>
                    <div className="column">
                        <InputField fieldName="ProxyServer" disabled={puppetInfo.loading} value={puppetInfo.server} onChange={(e) => setPuppetInfo(Object.assign({}, puppetInfo, {server: e.target.value}))} />
                        {puppetInfo.server
                            ? <>
                                <a disabled={puppetInfo.loading} className="button is-success is-pulled-right" onClick={(e) => getYoutubeMeta(e)}>정보 로드</a>
                                <InputField disabled={puppetInfo.loading} fieldName="YoutubeLink" value={puppetInfo.youtubeLink} onChange={(e) => setPuppetInfo(Object.assign({}, puppetInfo, {youtubeLink: e.target.value}))} />
                                <div className="field is-horizontal">
                                    <div className="field-label is-normal">
                                        <label className="label">RawContents</label>
                                    </div>
                                    <div className="field-body">
                                        <div className="field">
                                            <p className="control is-expanded">
                                                <textarea disabled={puppetInfo.loading} rows={10} className="textarea" value={puppetInfo.rawContent} />
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                            : null}
                        </div>

                </div>
                <hr />
                <form className="row">
                    <div className="columns">
                        <div className="column">
                            {_isEmpty(channelList)
                                ? <InputField disabled={disableInput} fieldName="유투버이름" name="youtubeName" placeholder="유투버이름" value={state.youtubeName} onChange={handleChangeInput}/>
                                : <>
                                    <SelectField disabled={disableInput} name="youtubeName" onChange={handleChangeInput} size={channelList.length}>
                                        {channelList.map(c => <option style={{
                                            "backgroundImage" :`url(${c.profileImg})`,
                                            "backgroundRepeat": "no-repeat",
                                            "backgroundSize": "40px",
                                            "textAlign": "start",
                                            "paddingLeft": "50px",
                                            // "whiteSpace": "pre-wrap"
                                        }} key={c.youtubeName} value={c.youtubeName}>{c.id} - {c.youtubeName}({c.youtubeId}) - {c.category}</option>)}
                                    </SelectField>
                                </>
                            }
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column">
                            <div className="field is-horizontal">
                                <div className="field-label is-normal">
                                    <label className="label">채널</label>
                                </div>
                                <div className="field-body">
                                    <div className="field">
                                        <p className="control is-expanded">
                                            <span>{state.youtubeName}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <InputField disabled={disableInput} fieldName="영상링크" name="youtubeContentsLink" placeholder="영상링크" value={state.youtubeContentsLink} onChange={handleChangeInput}/>
                            <InputField disabled={disableInput} fieldName="컨텐츠제목" name="contentsTitle" placeholder="컨텐츠제목" value={state.contentsTitle} onChange={handleChangeInput}/>
                            <InputField disabled={disableInput} fieldName="컨텐츠등록날짜" name="registerDate" placeholder="등록날짜" value={state.registerDate} onChange={handleDateText}/>
                            <InputField disabled={disableInput} fieldName="태그" name="tag" placeholder="태그" value={state.tag} onChange={handleChangeInput}/>
                            <InputField disabled={disableInput} fieldName="식당정보" name="store" placeholder="식당정보" value={state.store} onChange={handleChangeInput}/>
                            <button disabled={disableInput} className="button is-primary is-pulled-right" type="button" onClick={handleClick}>주소 확인</button>
                        </div>
                        <div className="column">
                            <InputField disabled={disableInput} fieldName="가게이름" name="storeName" placeholder="가게이름" value={state.storeName} onChange={handleChangeInput}/>
                            <InputField disabled={disableInput} fieldName="전화번호" name="tel" placeholder="전화번호" value={state.tel} onChange={handleChangeInput}/>
                            <a className="button is-success is-pulled-right" onClick={(e) => modifyLocation(state.address1)}>위/경도 수정</a>
                            <InputField disabled={disableInput} fieldName="주소1" name="address1" placeholder="주소1" value={state.address1} onChange={handleChangeInput}/>
                            <a className="button is-success is-pulled-right" onClick={(e) => modifyLocation(state.address2)}>위/경도 수정</a>
                            <InputField disabled={disableInput} fieldName="주소2" name="address2" placeholder="주소2" value={state.address2} onChange={handleChangeInput}/>
                            <a className="button is-success is-pulled-right" onClick={modifyLink}>링크 수정</a>
                            <a href={state.link} target="_blank" className="button is-link is-pulled-right">링크 확인</a>
                            <InputField disabled={disableInput} fieldName="링크" name="link" placeholder="링크" value={state.link} onChange={handleChangeInput}/>

                            <InputField disabled={disableInput} fieldName="위도" name="latitude" placeholder="위도" value={state.latitude} onChange={handleChangeInput}/>
                            <InputField disabled={disableInput} fieldName="경도" name="longitude" placeholder="경도" value={state.longitude} onChange={handleChangeInput}/>
                            <InputField disabled={disableInput} fieldName="영업 시간" name="availableTime" placeholder="영업 시간" value={state.availableTime} onChange={handleChangeInput}/>
                            <button disabled={disableInput} className="button is-primary is-pulled-right" type="submit" onClick={handleSubmit}>저장</button>
                        </div>
                    </div>
                </form>
                <div className="row is-vertical">
                    <h1 className="column is-size-5">기능 버튼</h1>
                    <div className="column is-top-paddingless">
                            <button className="button is-primary is-outlined" onClick={(e) => handleClearCache("캐시 삭제")}>캐시 삭제</button>
                    </div>
                    <div className="column is-top-paddingless">
                        <div className="box">
                            <p>{resultText}</p>
                        </div>
                    </div>
                </div>
            </>
            }
        </>
    )
}

export default MetaRegistForm;