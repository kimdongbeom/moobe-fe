import React, {useContext, useEffect, useState} from "react";
import {MapContext} from "components/common/map/KakaoMap";
import {MarkerClustererContext} from "components/common/map/MarkerClusterer";
import {delayObservable, updateObject} from "data/util";

const Marker = props => {
    const { kakao, map } = useContext(MapContext);
    const { clusterer } = useContext(MarkerClustererContext);
    const [state, setState] = useState({
        marker: null,
        kakao,
        map,
        clusterer
    });

    const setMarkerImage = (marker, imageUrl, imageOption) => {
        const { width, height } = imageOption;
        const markerImage = new kakao.maps.MarkerImage(
            imageUrl,
            new kakao.maps.Size(width, height)
        );
        marker.setImage(markerImage);
    };

    useEffect(() => {
        const { onClick, onMouseOver, onMouseOut, options, delay, attributes } = props;
        const { lat, lng, content, imageUrl, imageOption, zIndex } = options;
        const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(lat, lng),
            zIndex: zIndex ? zIndex : 1
        });

        if (attributes) {
            for (let key in attributes) {
                marker[key] = attributes[key]
            }
        }

        if (imageUrl && imageOption) setMarkerImage(marker, imageUrl, imageOption);
        const mouseOver = () => { if (onMouseOver) onMouseOver(marker);};
        const mouseOut = () => { if (onMouseOut) onMouseOut(marker);};
        const click = () => { if (onClick) onClick(marker);};
        kakao.maps.event.addListener(marker, "mouseover", mouseOver);
        kakao.maps.event.addListener(marker, "mouseout", mouseOut);
        kakao.maps.event.addListener(marker, "click", click);

        const subscription = delayObservable(delay ? delay : 0).subscribe({
            next(x) {},
            error(err) {},
            complete() {
                clusterer ? clusterer.addMarker(marker) : marker.setMap(map);
            }
        });

        setState({ ...state, marker });
        return () => {
            subscription.unsubscribe();
            kakao.maps.event.removeListener(marker, "mouseover", mouseOver);
            kakao.maps.event.removeListener(marker, "mouseout", mouseOut);
            kakao.maps.event.removeListener(marker, "click", click);
            if (clusterer && clusterer._markers.length) {
                clusterer.removeMarker(marker)
            } else {
                marker.setMap(null);
            }
        };
    }, []);

    useEffect(() => {
        const { zIndex } = props.options
        const { marker } = state;
        if (marker === null) return;
        if (zIndex) {
            marker.setZIndex(zIndex)
        }
    }, [props.options.zIndex])

    useEffect(() => {
        const { imageUrl, imageOption } = props.options;
        const { marker } = state;
        if (marker === null) return;
        if (imageUrl && imageOption) setMarkerImage(marker, imageUrl, imageOption);
    }, [props.options.imageUrl])
    //
    // useEffect(() => {
    //     const { lat, lng } = props.options;
    //     const { marker } = state;
    //     if (marker === null) return;
    //     const position = new kakao.maps.LatLng(lat, lng);
    //     marker.setPosition(position);
    // }, [props.options.lat, props.options.lng]);
    //
    // useEffect(() => {
    //     const { image } = props.options;
    //     const { marker } = state;
    //     if (marker === null || image === null) return;
    //     if (image) setMarkerImage(marker, image);
    // }, [props.options.image]);

    return null;
};

export default Marker;