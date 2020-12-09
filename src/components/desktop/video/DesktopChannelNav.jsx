import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import MarkerArrowSm from "assets/images/marker_arrow_sm.svg";
import OverlayFontAwesomeIcon from "components/common/icon/OverlayFontAwesomeIcon";
import {faArrowRight, faMinus} from "@fortawesome/free-solid-svg-icons";
import {SIDEBAR_EXPAND} from "assets/styles/colors";
import {buildChannelPath} from "data/util";
import {useHistory, useParams} from "react-router";
import {resetMapBounds, setMapLevel} from "data/redux/action/map";
import {isNil as _isNil} from 'lodash';
import {initMapLevel} from "data/redux/reducers/mapReducer";

const DesktopChannelNav = ({onClickExpand, expanded}) => {
    const {channelList} = useSelector(state => state.channel)
    return (
        <div>
            <div className={"is-flex has-margin-bottom-15 " + (expanded ? "  justify-space-between" : "")} onClick={onClickExpand}>
            {expanded
                ? <>
                    <span className="align-self-center">채널 목록</span>
                    <figure className="has-padding-5 clickable clickable-background">
                        <OverlayFontAwesomeIcon active={true} reverse={true} icon={faArrowRight} transform={"grow-8 right-5 rotate-180"} className={""} color={SIDEBAR_EXPAND}
                                                 overlayIcon={faMinus} overlayTransform={"rotate-90 grow-8 left-10"} overlayClassName={""} overlayColor={SIDEBAR_EXPAND}/>
                    </figure>
                 </>
                : <figure className="has-padding-5 clickable clickable-background">
                    <OverlayFontAwesomeIcon active={true} reverse={true} icon={faArrowRight} transform={"grow-8 right-5"} className={""} color={SIDEBAR_EXPAND}
                                         overlayIcon={faMinus} overlayTransform={"rotate-90 grow-8 left-10"} overlayClassName={""} overlayColor={SIDEBAR_EXPAND}/>
                </figure>
            }
            </div>
            <SideBarChannel channel={null} expanded={expanded} />
            {channelList.map(channel => <SideBarChannel key={channel.id} channel={channel} expanded={expanded} />)}
        </div>
    )
}

const SideBarChannel = ({channel, expanded}) => {
    const {channelId} = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    const {channelLoading} = useSelector(state => state.channel)
    const onClickChannel = () => {
        if (channelLoading) {
            return ;
        }
        if (!_isNil(channel) && channelId == channel.id) {
            return ;
        }

        dispatch(resetMapBounds());
        dispatch(setMapLevel(initMapLevel));
        history.push(buildChannelPath(channel))

    }
    return (
        <div className="has-margin-bottom-10" onClick={onClickChannel}>
            {expanded
                ? <div className="is-flex has-padding-5 clickable clickable-background justify-flex-start">
                    <figure className="image has-margin-right-10">
                        <img className="image box is-paddingless has-margin-auto has-min-height-32 has-min-width-32 is-32x32 is-rounded" src={channel ? channel.profileImg : MarkerArrowSm }/>
                    </figure>
                    <span className="align-self-center text-overflow-ellipsis">{channel ? channel.youtubeName : "전체 채널"}</span>
                </div>
                :
                <figure className="image">
                    <img className="image box is-paddingless clickable has-margin-auto has-min-height-32 has-min-width-32 is-32x32 is-rounded" src={channel ? channel.profileImg : MarkerArrowSm}/>
                </figure>
            }
        </div>
    )
}


export default DesktopChannelNav;