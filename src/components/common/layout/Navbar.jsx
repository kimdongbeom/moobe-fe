import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import MoobeBrand from 'assets/images/moobe_brand.png';
import {faCircle, faExclamation, faMap, faStar} from "@fortawesome/free-solid-svg-icons";
import {faCircle as fasCircle, faMap as fasMap, faStar as fasStar} from '@fortawesome/free-regular-svg-icons'
import {useHistory, useParams} from "react-router";
import {buildChannelPath} from "data/util";
import MoobeNavbarLogin from "components/common/login/NavbarLogin";
import {requireUser} from "data/redux/action/user";
import OverlayFontAwesomeIcon from "components/common/icon/OverlayFontAwesomeIcon";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NAV_ICON_ACTIVE, NAV_ICON_BORDER} from "assets/styles/colors";
import SearchBar from "components/common/search/Search";
import {EMPTY_IMAGE} from "assets/styles/const";
import {aboutPage, contentPage, favoritePage} from "data/router-util";
import {useMobile} from "components/common/layout/WindowDimensions";
import {resetMapBounds, setMapLevel} from "data/redux/action/map";
import {initMapLevel} from "data/redux/reducers/mapReducer";

const NavContent = ({channel}) => (
    <>
        <div className="media-left">
            <figure className="image">
                {channel != null
                ? <img className="image has-min-height-32 has-min-width-32 is-32x32 is-rounded" src={channel.profileImg}/>
                :<img className="image has-min-height-32 is-rounded" src={EMPTY_IMAGE}/> }
            </figure>
        </div>
        <div className="media-content align-self-center">
            <p className="subtitle">
                {channel != null ? channel.youtubeName : "전체 채널"}
            </p>
        </div>
    </>
);

const NavItem = ({channel}) => {
    const {channelLoading} = useSelector(state => state.channel);
    const dispatch = useDispatch();
    const history = useHistory();
    const onClickChannel = () => {
        if (channelLoading) {
            return ;
        }

        dispatch(resetMapBounds());
        dispatch(setMapLevel(initMapLevel));
        history.push(buildChannelPath(channel))
    }
    return (
        <>
            <a className="navbar-item media is-marginless flex-mobile"
               onClick={onClickChannel}>
                <NavContent channel={channel}/>
            </a>
        </>
    )
};

const NavItems = () => {
    const [channelDropdownActive, setChannelDropdownActive] = useState(false);
    const {channelList, activeChannel, channelLoading} = useSelector(state => state.channel);

    useEffect(() => {
        setChannelDropdownActive(false)
    }, [activeChannel, channelLoading]);

    const channelDropdownClassName = () => channelLoading
        ? "navbar-item item has-dropdown is-paddingless-mobile disabled"
        : channelDropdownActive
            ? "navbar-item item has-dropdown is-paddingless-mobile is-active"
            : "navbar-item item has-dropdown is-paddingless-mobile";

    const mobileChannelDropdownClassName = () => channelLoading
        ? "navbar-dropdown disabled is-hidden-touch"
        : channelDropdownActive
            ? "navbar-dropdown"
            : "navbar-dropdown is-hidden-touch";

    const toggleChannelDropdown = () => channelLoading ? "" : setChannelDropdownActive(!channelDropdownActive);

    return (
        <div className={channelDropdownClassName()}>
            <div className="navbar-link flex-mobile " onClick={toggleChannelDropdown}>
                <NavContent channel={activeChannel}/>
            </div>
            <div className={mobileChannelDropdownClassName()}>
                {activeChannel != null ? <NavItem channel={null}/> : null}
                {channelList.map(channel => {
                    if (activeChannel != null && channel.id === activeChannel.id) {
                        return null;
                    }
                    return <NavItem key={channel.id} channel={channel}/>
                })}
            </div>
        </div>
    )
};

const MobileNavHeader = ({showSearch}) => {
    return (
        <div className="navbar-item flex-grow-1 is-hidden-tablet is-full-width mobile-search is-paddingless is-marginless has-margin-left-auto field has-addons">
            {showSearch ? <SearchBar /> : null}
        </div>
    )
};

const DesktopSearchBar = ({showSearch}) => {
    return (
        <div className="navbar-item flex-grow-1 is-hidden-mobile has-max-width-500 is-paddingless has-padding-right-15 is-marginless field has-addons">
            {showSearch ? <SearchBar /> : null}
        </div>
    )
};

const AuthLink = ({to, className, children}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const onClickLink = () => {
        dispatch(requireUser(() => history.push(to)))
    };
    return (
        <>
            <Link to={"#"} onClick={onClickLink} className={className}>{children}</Link>
        </>
    )
};

const MoobeNavBar = ({type}) => {
    const [burgerActive, setBurgerActive] = useState(false);
    const {channelId, contentId} = useParams();
    const mobile = useMobile();
    const history = useHistory();
    const dispatch = useDispatch();

    const {enableGeolocation} = useSelector(state => state.map)

    useEffect(() => {
        setBurgerActive(false);
    }, [channelId, contentId, type]); //update active channel data every location changed.

    useEffect(() => {
        if (type === favoritePage) {
            dispatch(requireUser(null, () => history.push("/")))
        }
    }, [])

    const burgerClassName = () => burgerActive
        ? "navbar-burger burger has-padding-right-10 has-padding-left-10 is-active"
        : "navbar-burger burger has-padding-right-10 has-padding-left-10";
    const navbarMenuClassName = () => burgerActive
        ? "moobe-navbar-menu navbar-menu navbar-end has-text-centered has-padding-left-50-mobile has-padding-left-15-tablet is-active"
        : "moobe-navbar-menu navbar-menu navbar-end has-text-centered has-padding-left-50-mobile has-padding-left-15-tablet";

    return (
        <>
            <nav className="navbar is-light ">
                <section className="container is-fullwidth has-margin-left-55-tablet has-margin-right-55-tablet ">
                    <div className="navbar-brand has-padding-left-10 has-padding-left-5-mobile">
                        <a className="is-flex has-padding-right-10-mobile align-items-center" href="/" role="button">
                            <img className="" src={MoobeBrand} alt="Moobe"/>
                            {/*<img className="is-hidden-tablet" src={MoobeLogo} alt="Moobe"/>*/}
                        </a>
                        <MobileNavHeader showSearch={type === contentPage} />
                        <a role="button" onClick={() => setBurgerActive(!burgerActive)}
                           className={burgerClassName()} aria-label="menu" aria-expanded="false"
                           data-target="navbarMenu">
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                            <span aria-hidden="true"></span>
                        </a>
                    </div>
                    {burgerActive ? <div className="mobile-navbar-background" onClick={(e) => setBurgerActive(false)}/> : null}
                    <div id="navbarMenu" className={navbarMenuClassName()}>
                        {mobile ? <div className="navbar-start"> {type === contentPage? <NavItems /> : null} </div> : null}
                        <DesktopSearchBar showSearch={type === contentPage}/>
                        <Link to={"/"} className="navbar-item item flex-mobile">
                            <p className="subtitle">
                                <OverlayFontAwesomeIcon
                                    active={type === contentPage}
                                    icon={fasMap}
                                    color={NAV_ICON_BORDER}
                                    overlayIcon={faMap}
                                    overlayColor={NAV_ICON_ACTIVE}
                                    overlayTransform={"shrink-2"}/>
                                <small className="has-text-weight-semibold has-padding-left-15  is-hidden-tablet">지도</small>
                            </p>
                        </Link>
                        <AuthLink to={"/favorite"} className="navbar-item item flex-mobile">
                            <p className="subtitle">
                                <OverlayFontAwesomeIcon
                                    active={type === favoritePage}
                                    icon={fasStar}
                                    color={NAV_ICON_BORDER}
                                    overlayIcon={faStar}
                                    overlayColor={NAV_ICON_ACTIVE} />
                                <small className="has-text-weight-semibold has-padding-left-15 is-hidden-tablet">즐겨찾기</small>
                            </p>
                        </AuthLink>
                        <Link to={"/about"} className="navbar-item item flex-mobile">
                            <p className="subtitle">
                                <OverlayFontAwesomeIcon
                                    active={type === aboutPage}
                                    icon={fasCircle}
                                    color={NAV_ICON_BORDER}
                                    transform={"grow-4"}
                                    overlayIcon={faCircle}
                                    overlayColor={NAV_ICON_ACTIVE}
                                    overlayTransform={"grow-2"}
                                    children={<FontAwesomeIcon icon={faExclamation} transform={"shrink-5"} />}/>
                                <small className="has-text-weight-semibold has-padding-left-15  is-hidden-tablet">about</small>
                            </p>
                        </Link>
                        <div className="navbar-item item flex-mobile">
                            <MoobeNavbarLogin />
                        </div>
                    </div>
                </section>
            </nav>
        </>
    )
};


export default MoobeNavBar;