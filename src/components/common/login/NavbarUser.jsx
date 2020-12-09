import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {LOGOUT_REDIRECT_URL} from "data/api";

const DesktopNavbarUserDropdown = ({user, logout}) => {
    return (
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
                <div className="card is-shadowless">
                    <div className="card-content is-paddingless has-padding-15">
                        <div className="media">
                            <div className="media-left">
                                <figure className="image is-48x48">
                                    <img className="has-max-height-50 is-rounded" src={user.imageUrl} alt="Placeholder image" />
                                </figure>
                            </div>
                            <div className="media-content">
                                <small className="has-text-weight-semibold">
                                    {user.nickname}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="dropdown-divider"/>
                <a onClick={logout} className="dropdown-item">
                    <FontAwesomeIcon icon={faSignOutAlt} size='lg'/>
                    <span className="has-padding-left-5">로그아웃</span>
                </a>
            </div>
        </div>
    )
};

export const DesktopNavbarUser = ({user, logout}) => {
    const [isActiveDropdown, setIsActiveDropdown] = useState(false)

    const toggleDropdown = (isActive = undefined) => {
        if(isActive === undefined) {
            setIsActiveDropdown(!isActiveDropdown)
        } else {
            setIsActiveDropdown(isActive)
        }
    };

    const dropDownClassName = () => isActiveDropdown
        ? "dropdown is-hidden-mobile is-right is-active"
        : "dropdown is-hidden-mobile is-right";

    return (
        <div className={dropDownClassName()}>
            <div className="dropdown-trigger" onClick={() => toggleDropdown()}>
                <button style={{backgroundImage: `url(${user.imageUrl})`}} className="button is-background-size-contain is-32x32 is-rounded is-paddingless" aria-controls="dropdown-menu" />
            </div>
            <DesktopNavbarUserDropdown user={user} logout={logout}/>
        </div>
    )
};

export const MobileNavbarUser = ({user, logout}) => {
    return (
        <div className="media is-full-width is-hidden-tablet">
            <div className="media-left">
                <figure className="image is-32x32">
                    <img className="has-max-height-50 is-rounded" src={user.imageUrl} alt="Placeholder image" />
                </figure>
            </div>
            <div className="media-content">
                <small className="has-text-weight-semibold">
                    {user.nickname}
                </small>
            </div>
            <div className="button has-padding-left-10 is-pulled-right" onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} size='sm'/>
                <small className="has-padding-left-5">로그아웃</small>
            </div>
        </div>
    )
};

const MoobeNavbarUser = () => {
    const {user} = useSelector(state => state.user)
    const toLogout = () => {
        window.location = LOGOUT_REDIRECT_URL
    };
    return (
        <>
            <DesktopNavbarUser user={user} logout={toLogout}/>
            <MobileNavbarUser user={user} logout={toLogout}/>
        </>
    )
};

export default MoobeNavbarUser;