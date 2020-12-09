import React, {useEffect, useState} from 'react';
import LoadingOverlay from "react-loading-overlay";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faInfo, faSpinner, faTimesCircle} from '@fortawesome/free-solid-svg-icons'
import withJs from "components/common/map/WithJs";
import withKakaoMap from "components/common/map/WithKakaoMap";
import KakaoMap from "components/common/map/KakaoMap";
import {useDispatch, useSelector} from "react-redux";
import {isMobile} from "react-device-detect";
import MapImages from "assets/images/map_images.png"
import {
    loadingGeoLocationFail,
    loadingGeoLocationStarted,
    loadingGeoLocationSuccess,
    setMapBoundChanged,
    setMapBounds,
    setMapCenterChange,
    setMapCenterForce,
    setMapLevel
} from "data/redux/action/map";
import {MapLoadingSpinner} from "components/common/layout/PresentUtil";
import {isEmpty as _isEmpty, isNil as _isNil} from 'lodash'
import GeoLocationMarker from "components/common/map/GeoLocationMarker";
import {MAP_LOADING_SPINNER} from "assets/styles/colors";
import SearchCurrentButton from "components/common/map/SearchCurrentButton";
import debounce from 'lodash.debounce';
import {buildKakaoMapBounds, buildMoobeMapBounds, isSimilarLocation} from "data/util";
import queryString from "query-string";
import {useLocation, useParams} from "react-router";
import SearchWideLocationButton from "components/common/map/SearchWideLocationButton";
import {getWindowDimensions, initVH} from "components/common/layout/WindowDimensions";
import {initMapLevel} from "data/redux/reducers/mapReducer";

const Kakao = withJs(
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
        process.env.REACT_APP_KAKAO_API_KEY
    }&libraries=services,clusterer,drawing&autoload=false`
)(withKakaoMap(KakaoMap));


const MoobeKakaoMap = (props) => {
    const dispatch = useDispatch();
    const {focusedMapLocation} = useSelector(state => state.mapLocation)
    const {contentDetail} = useSelector(state => state.contentDetail)
    const location = useLocation();
    const {swLat, swLng, neLat, neLng, level: queryMapLevel} = queryString.parse(location.search);
    const {
        centerLat,
        centerLng,
        refreshCenter,
        mapLoading,
        changedCenterLat,
        changedCenterLng,
        enableGeolocation,
        geoLocationCenterLat,
        geoLocationCenterLng,
        geolocationLoading,
        mapLevel,
        mapBounds, mapBoundMargins} = useSelector(state => state.map);
    const [bounds, setBounds] = useState(buildKakaoMapBounds(buildMoobeMapBounds(swLat, swLng, neLat, neLng)));
    const [level, setLevel] = useState(queryMapLevel);
    const initialOptions = {
        lat: centerLat,
        lng: centerLng,
        level: level,
        refreshCenter: refreshCenter,
        zoom: props.zoom ? props.zoom : "TOPRIGHT"
    };

    useEffect(() => {
        return () => {
            dispatch(loadingGeoLocationFail()); // reset geolocation
        }
    }, []);

    //mapBounds의 변화에 따라 지도의 bound를 바꿈
    useEffect(() => {
        if (_isNil(mapBounds)) {
            setLevel(initMapLevel);
            dispatch(setMapLevel(initMapLevel));
            dispatch(setMapCenterForce({lat: process.env.REACT_APP_INIT_MAP_CENTER_LAT, lng:process.env.REACT_APP_INIT_MAP_CENTER_LNG}));
            dispatch(setMapBounds([]));
        } else if(_isEmpty(mapBounds)) {
            //pass
        } else {
            setBounds(mapBounds)
        }
    }, [mapBounds])

    useEffect(() => {
        setLevel(mapLevel);
    }, [mapLevel])

    //content를 선택 하면 지도 center를 옮기고 이전화면으로 돌아왔을때 mapBound설정.
    useEffect(() => {
        if (isMobile || mapLoading) {
            return ;
        }
        if (!_isEmpty(contentDetail)) {
            if (mapLevel > 6) {
                dispatch(setMapLevel(6))
            }
            dispatch(setMapCenterForce({lat: contentDetail.store.latitude, lng: contentDetail.store.longitude}));
        } else {
            let queryMapBound = buildMoobeMapBounds(swLat, swLng, neLat, neLng);
            if (!_isNil(queryMapBound)) {
                dispatch(setMapBounds(buildKakaoMapBounds(queryMapBound)));
            } else {
                resetMap()
            }
        }
    }, [contentDetail,swLat, swLng, neLat, neLng, mapLoading])

    //content를 선택했다가 이전화면으로 돌아왔을때 mapBound설정.
    useEffect(() => {
        if (!isMobile || mapLoading) {
            return ;
        }
        if (!_isEmpty(focusedMapLocation)) {
            if (mapLevel > 5) {
                dispatch(setMapLevel(5))
            }
            dispatch(setMapCenterForce({lat: focusedMapLocation.latitude, lng: focusedMapLocation.longitude}));
        } else {
            let queryMapBound = buildMoobeMapBounds(swLat, swLng, neLat, neLng);
            if (!_isNil(queryMapBound)) {
                dispatch(setMapBounds(buildKakaoMapBounds(queryMapBound)));
            } else {
                resetMap();
            }
        }
    }, [focusedMapLocation,swLat, swLng, neLat, neLng, mapLoading])

    const resetMap = () => {
        setLevel(initMapLevel);
        dispatch(setMapLevel(initMapLevel));
        dispatch(setMapCenterForce({lat: process.env.REACT_APP_INIT_MAP_CENTER_LAT, lng:process.env.REACT_APP_INIT_MAP_CENTER_LNG}));
        dispatch(setMapBounds([]));
    }

    const toggleGeolocation = () => {
        dispatch(loadingGeoLocationStarted());
        if(enableGeolocation) {
            dispatch(loadingGeoLocationFail()); //call force failed to disable geolocation for a moment
            setTimeout(() => {
                dispatch(loadingGeoLocationSuccess());
            }, 500) //delay for geo marker unmount
        } else {
            setTimeout(() => {
                dispatch(loadingGeoLocationSuccess());
            }, 200) //delay for user wait
        }
    };

    const showDevInfo = () => {
        initVH()
        const dimention = getWindowDimensions()

        const vh = getWindowDimensions().height * 0.01;
        alert("width : " + dimention.width + "\n" +
            "height : " + dimention.height + "\n" +
            "vh : " + vh + "\n" +
            "document.body.scrollHeight : " + document.body.scrollHeight + "\n" +
            "document.body.clientHeight : " + document.body.clientHeight + "\n" +
            "document.documentElement.scrollHeight : " + document.documentElement.scrollHeight + "\n" +
            "document.documentElement.clientHeight : " + document.documentElement.clientHeight + "\n" +
            "document.height : " + document.height + "\n"
        )
    }

    //every map center changed, save changed center and bounds for search current location
    const centerChange = (map) => {
        let center = map.getCenter();
        dispatch(setMapCenterChange({lat: center.getLat(), lng: center.getLng()}));
    };

    const boundChange = (map) => {
        let bounds = map.getBounds();
        let sw = bounds.getSouthWest(), ne = bounds.getNorthEast();
        dispatch(setMapBoundChanged({swLat: sw.getLat(), swLng: sw.getLng(), neLat: ne.getLat(), neLng: ne.getLng()}));
    };

    const zoomChange = (map) => {
        dispatch(setMapLevel(map.getLevel()));
    }

    const geoLocationCenterChanged = () => {
        return !isSimilarLocation({lat: changedCenterLat, lng: changedCenterLng}, {lat: geoLocationCenterLat, lng: geoLocationCenterLng})
    }
    return (
        <>
            <Loading>
                <Kakao className={props.className}
                        options={Object.assign(initialOptions, {zoom: props.zoom}, {bounds}, {boundMargins: mapBoundMargins}, {refreshCenter})}
                        onZoomChange={debounce(zoomChange, 100)}
                        onCenterChange={debounce(centerChange, 100)}
                        onBoundsChange={debounce(boundChange, 100)}>
                    {props.children}
                    {enableGeolocation ? <GeoLocationMarker/> : null}
                </Kakao>
                <button style={{
                    backgroundImage: geolocationLoading ? "" : 'url(' + MapImages + ')',
                    backgroundSize: "453px 434px",
                    color: geolocationLoading ? "" : "transparent"
                }} className={"button geo-button" + (isMobile ? " mobile" : "") + (enableGeolocation && !geoLocationCenterChanged() ? " active" : "")} onClick={toggleGeolocation}>
                    {geolocationLoading ? <FontAwesomeIcon className="fast-spin" icon={faSpinner} size={"lg"}/> : null }
                </button>
                {process.env.REACT_APP_ENV !== 'real'
                ? <button className={"button dev-button"  + (isMobile ? " mobile" : "")} id={"showDevInfo"} onClick={showDevInfo} >
                        <FontAwesomeIcon icon={faInfo} size={"1x"} />
                    </button>
                : null}
                <SearchCurrentButton />
                <SearchWideLocationButton />

            </Loading>
        </>
    )
};

const Loading = (props) => {
    const {mapLoading, errorMapLoading} = useSelector(state => state.map);
    const loadingText = () => errorMapLoading ? "지도를 불러오는데에 실패했습니다. 일시적인 문제일 수 있습니다. 페이지를 다시 로딩 해 주세요." : "Loading...";
    const loadingSpinner = () => errorMapLoading ? <h2><FontAwesomeIcon icon={faTimesCircle} size='3x' /></h2>
        : <h6><MapLoadingSpinner color={MAP_LOADING_SPINNER} loading={true} /></h6>;
    return (
        <LoadingOverlay
            fadeSpeed={200}
            className={"loading-overlay box column is-full kakao-map is-fullheight-with-navbar-tablet is-fullheight-with-navbar-mobile is-paddingless"}
            active={mapLoading || errorMapLoading}
            spinner={loadingSpinner()}
            text={loadingText()}
        >
            {props.children}
        </LoadingOverlay>
    )
};

export default MoobeKakaoMap;