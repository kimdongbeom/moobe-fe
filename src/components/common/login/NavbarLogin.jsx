import React, {useEffect} from 'react';
import { useCookies } from "react-cookie";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons";
import {isNil as _isNil} from 'lodash';
import {useDispatch, useSelector} from "react-redux";
import {fetchUser} from "data/redux/action/user";
import MoobeNavbarUser from "components/common/login/NavbarUser";
import {LOGIN_REDIRECT_URL} from "data/api";
import {MOOBE_COOKIE_USER} from "assets/styles/const";

export const MoobeNavbarLogin = () => {
    const [cookies] = useCookies([MOOBE_COOKIE_USER])
    const {user} = useSelector(state => state.user)
    const dispatch = useDispatch();

    const toLogin = () => {
        window.location = LOGIN_REDIRECT_URL
    };

    useEffect(() => {
        if (cookies[MOOBE_COOKIE_USER]) {
            dispatch(fetchUser())
        }
    }, [cookies])
    return (
        <>
        {_isNil(user)
            ? <div onClick={(e) => toLogin()} className="button is-borderless is-full-width-mobile">
                <FontAwesomeIcon icon={faUserCircle} size='lg'/>
                <span className="has-padding-left-10"> 로그인</span>
            </div>
            : <MoobeNavbarUser />
        }
        </>

    )
};

export default MoobeNavbarLogin;