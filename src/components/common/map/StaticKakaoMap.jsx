import React, {useEffect, useRef, useState} from "react";
import VisibilitySensor from "react-visibility-sensor";

export const StaticMapContext = React.createContext({});

const StaticKakaoMap = props => {
    const [state, setState] = useState({
        map: null,
        kakao: props.kakao
    });
    const [mapVisible, setMapVisible] = useState(false);

    const mapRef = useRef(null);
    useEffect(() => {
        if (!mapVisible) return;
        const { kakao } = props;
        const { lat, lng, level, markerOptions } = props.options;
        const node = mapRef.current;
        if (state.map || node === null) {
            return;
        }
        const marker = markerOptions ? {
            position: new kakao.maps.LatLng(markerOptions.lat, markerOptions.lng),
            text: markerOptions.text
        } : {};
        const staticMapOption = {
            level: level || 9,
            center: new kakao.maps.LatLng(lat, lng)
        };

        const map = new kakao.maps.StaticMap(node, Object.assign({}, staticMapOption, {marker}));
        setState({map, kakao});
        return () => {};
    }, [mapVisible]);

    const onClickStaticMap = (e) => {
        if (props.onClick) {
            props.onClick(e)
            e.stopPropagation();
        }
    }

    return (
        <VisibilitySensor onChange={(v) => setMapVisible(v)}>
            <div className={props.className} id="static-kakao-map" ref={mapRef} onClick={onClickStaticMap}>
                {state.map === null ? null : (
                    <StaticMapContext.Provider value={state}>
                        {props.children}
                    </StaticMapContext.Provider>
                )}
            </div>
        </VisibilitySensor>
    );
};

export default StaticKakaoMap;