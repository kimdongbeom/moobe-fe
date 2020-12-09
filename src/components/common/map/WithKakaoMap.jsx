import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {loadingMapFail, loadingMapFinished} from "data/redux/action/map";

const withKakaoMap = BaseComponent => {
    return props => {
        const [state, setState] = useState({
            kakaoLoaded: false,
            kakao: null
        });

        const dispatch = useDispatch()
        useEffect(() => {
            const kakao = window.kakao;
            if ( kakao === undefined) {
                dispatch(loadingMapFail());
                dispatch(loadingMapFinished());
            } else {
                kakao.maps.load(() => {
                    setState({ kakaoLoaded: true, kakao });
                });
            }
        }, []);

        if (state.kakaoLoaded) {
            return <BaseComponent {...props} kakao={state.kakao} />;
        } else {
            return <div />;
        }
    };
};

export default withKakaoMap;