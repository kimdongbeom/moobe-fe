import React, {useCallback, useContext, useEffect, useState} from "react";
import {MapContext} from "components/common/map/KakaoMap";
import Marker from "components/common/map/Marker";

const InfoWindoWithMarker = props => {
    const { kakao, map } = useContext(MapContext);
    const [state, setState] = useState({
        infoWindow: null,
        kakao,
        map
    });

    const onMouseOver = marker => {
        const { infoWindow } = state;
        infoWindow.open(map, marker);
    };

    const onMouseOut = marker => {
        const { infoWindow } = state;
        infoWindow.close(map);
    };

    const onClick = marker => {
        if (props.onClick) {
            const { infoWindow } = state;
            props.onClick(map, infoWindow, marker)
        }
    };

    const overlayRef = useCallback(node => {
        if (state.infoWindow !== null) return;
        if (node == null) return;
        return initInfoWindow(node.firstChild);
    }, []);

    useEffect(() => {
        if (props.children) {

        } else {
            const content = document.createElement("div");
            content.className = props.className;
            content.innerHTML = props.options.content;
            return initInfoWindow(content);
        }

    }, []);

    const initInfoWindow = (content) => {
        const { lat, lng } = props.options;
        const infoWindow = new kakao.maps.InfoWindow({
            position: new kakao.maps.LatLng(lat, lng),
            content: content
        });
        setState({ ...state, infoWindow });
        return () => {
            infoWindow.setMap(null);
        };
    };

    return state.infoWindow === null ? null : (
        <Marker
            delay={props.delay}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
            onClick={onClick}
            options={props.options}
        />
    );
};

export default InfoWindoWithMarker;