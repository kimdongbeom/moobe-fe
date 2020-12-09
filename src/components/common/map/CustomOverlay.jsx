import React, {useCallback, useContext, useEffect, useState} from "react";
import {MapContext} from "components/common/map/KakaoMap";

const CustomOverlay = props => {
    const { kakao, map } = useContext(MapContext);
    const [state, setState] = useState({
        overlay: null,
        kakao,
        map
    });

    const overlayRef = useCallback(node => {
        const { clickable, offsetY, yAnchor, xAnchor, zIndex} = props.options ? props.options : {};
        const lat = props.lat;
        const lng = props.lng;
        if (state.overlay !== null) return;
        if (node == null) return;
        // const offsetFromLocation = offsetY ? offsetY : 54 ; // 위도 경도의 위치와 떨어진 정도 pixel, marker image height + custom overlay arrow height
        const overlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(lat, lng),
            content: node.firstChild,
            clickable: clickable ? clickable : true,
            yAnchor: yAnchor ? yAnchor : offsetY ? (1 + (offsetY/node.firstChild.offsetHeight)) : 0.5,
            xAnchor: xAnchor ? xAnchor : 0.5,
            zIndex: zIndex ? zIndex : 1,
        });
        if (props.visible) {
            overlay.setMap(map);
        }
        setState(Object.assign(state, { overlay }));
        return () => {
            overlay.setMap(null)
        }
    }, []);

    useEffect(() => {
        const { lat, lng, visible } = props;
        const { overlay } = state;
        if (overlay === null) return;
        overlay.setPosition(new kakao.maps.LatLng(lat, lng));
        if (visible) {
            overlay.setMap(map);
        } else {
            overlay.setMap(null);
        }
        return () => {
            overlay.setMap(null)
        }
    }, [props.lat, props.lng, props.visible]);

    useEffect(() => {
        const { zIndex } = props.options
        const { overlay } = state;
        if (overlay === null) return;
        if (zIndex) {
            overlay.setZIndex(zIndex)
        }
    }, [props.options.zIndex])


    return <div ref={overlayRef}>
            {props.children}
        </div>
};

export default CustomOverlay;
