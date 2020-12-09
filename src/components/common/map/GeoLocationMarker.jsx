import React, {useEffect, useState} from "react";
import OverlayFontAwesomeIcon from "components/common/icon/OverlayFontAwesomeIcon";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import CustomOverlay from "components/common/map/CustomOverlay";
import {usePosition} from 'use-position';
import {useDispatch, useSelector} from "react-redux";
import {
    loadingGeoLocationFail,
    loadingGeoLocationFinished,
    setGeoLocationCenter,
    setMapCenterForce, setSearchOnBoundChange
} from "data/redux/action/map";
import {MAP_GEOLOCATION_MARKER, MAP_GEOLOCATION_MARKER_BACKGROUND} from "assets/styles/colors";

const GeoLocationMarker = () => {
    const { latitude, longitude, timestamp, accuracy, error } = usePosition( {enableHighAccuracy: false, maximumAge: 3000});
    const {geoLocationCenterLat, geoLocationCenterLng} = useSelector(state => state.map);
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch()
    useEffect(() => {
        if (error) {
            console.log(error);
            alert("내 위치 확인을 위해 사용기기 및 브라우저의 설정에서 '위치정보' 사용을 허용해주시기 바랍니다.")
            dispatch(loadingGeoLocationFail());
            dispatch(loadingGeoLocationFinished());
            setVisible(false);
        } else if (!visible && (latitude && longitude)) {
            dispatch(loadingGeoLocationFinished());
            setVisible(true);
        }
    }, [latitude, longitude, error])

    useEffect(() => {
        if (visible) {
            dispatch(setGeoLocationCenter({lat: latitude, lng: longitude}));
            dispatch(setSearchOnBoundChange(true))
            dispatch(setMapCenterForce({lat: latitude, lng: longitude}));
        }
    }, [visible])

    return (
        <CustomOverlay lat={geoLocationCenterLat} lng={geoLocationCenterLng} visible={visible} options={{clickable: false, yAnchor: 0.5, xAnchor: 0.5}} >
            <OverlayFontAwesomeIcon active={true} reverse={true} icon={faCircle} transform={"grow-8"} className={"fa-beat"} color={MAP_GEOLOCATION_MARKER_BACKGROUND}
                                    overlayIcon={faCircle} overlayTransform={""} overlayClassName={"fa-beat fa-thick"} overlayColor={MAP_GEOLOCATION_MARKER}/>
        </CustomOverlay>
    )
};

export default GeoLocationMarker;