import React, {useCallback, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {
    loadingMapFinished,
    loadingMapStarted,
    loadingMapSuccess,
    setMapBoundChanged,
    setMapLevel,
} from "data/redux/action/map";
import {initVH} from "components/common/layout/WindowDimensions";
import {isSimilarLocation, nullFunction} from "data/util";
import {initMapLevel} from "data/redux/reducers/mapReducer";

export const MapContext = React.createContext({});

const KakaoMap = props => {
    const [state, setState] = useState({
        map: null,
        kakao: props.kakao
    });
    const dispatch = useDispatch();
    const addZoomControl = (map, kakao, zoom) => {
        if (zoom) {
            map.addControl(
                new kakao.maps.ZoomControl(),
                kakao.maps.ControlPosition[zoom]
            );
        }
    };

    const addMapTypeControl = (map, kakao, mapType) => {
        if (mapType) {
            map.addControl(
                new kakao.maps.MapTypeControl(),
                kakao.maps.ControlPosition[mapType]
            );
        }
    };

    const setLevel = (map, kakao, level) => {
        //TODO?
    }

    const setLatLngBounds = (map, kakao, bounds, boundMargins) => {
        if (bounds) {
            const latLngBounds = new kakao.maps.LatLngBounds();
            bounds.forEach(b => {
                latLngBounds.extend(new kakao.maps.LatLng(b.lat, b.lng));
            });
            if (boundMargins) {
                map.setBounds(latLngBounds, ...boundMargins);
            } else {
                map.setBounds(latLngBounds, -50, -50, -50, -50);
            }

        }
    };


    const handleLoaded = useCallback(node => {
        const { kakao, onZoomChange, onZoomChangeStart, onCenterChange, onBoundsChange } = props;
        const { lat, lng, level, zoom, mapType, bounds, boundMargins } = props.options;
        if (state.map || node === null) {
            return;
        }

        initVH(); //initial viewport height
        dispatch(loadingMapStarted());
        const map = new kakao.maps.Map(node, {
            level: level || 9,
            center: new kakao.maps.LatLng(lat, lng),
        });
        map.setCopyrightPosition(kakao.maps.CopyrightPosition.BOTTOMRIGHT, true)
        map.setZoomable(true);

        addZoomControl(map, kakao, zoom);
        addMapTypeControl(map, kakao, mapType);
        setLatLngBounds(map, kakao, bounds, boundMargins);

        const zoomChange = () => {
            if (onZoomChange) onZoomChange(map);
        };
        const zoomChangeStart = () => {
            if (onZoomChangeStart) onZoomChangeStart(map);
        };
        const centerChange = () => {
            if (onCenterChange) onCenterChange(map);
        };
        const boundsChange = () => {
            if (onBoundsChange) onBoundsChange(map);
        }

        kakao.maps.event.addListener(map, "zoom_changed", zoomChange);
        kakao.maps.event.addListener(map, 'zoom_start',zoomChangeStart);
        kakao.maps.event.addListener(map, "center_changed", centerChange);
        kakao.maps.event.addListener(map, "bounds_changed", boundsChange);

        setState({map, kakao});
        dispatch(setMapLevel(map.getLevel()))
        if (bounds) {
            let initBounds = map.getBounds();
            let sw = initBounds.getSouthWest(), ne = initBounds.getNorthEast();
            dispatch(setMapBoundChanged({swLat: sw.getLat(), swLng: sw.getLng(), neLat: ne.getLat(), neLng: ne.getLng()}));
        } else {
            //set initial map bounds
            let bounds = map.getBounds();
            let sw = bounds.getSouthWest(), ne = bounds.getNorthEast();
            dispatch(setMapBoundChanged({swLat: sw.getLat(), swLng: sw.getLng(), neLat: ne.getLat(), neLng: ne.getLng()}));
        }
        dispatch(loadingMapSuccess(map, node, kakao));
        dispatch(loadingMapFinished());

        return () => {
            kakao.maps.event.removeListener(map, "zoom_changed", zoomChange);
            kakao.maps.event.removeListener(map, "center_changed", centerChange);
            kakao.maps.event.removeListener(map, "bounds_changed", boundsChange);
        };
    }, []);

    useEffect(() => {
        const { lat, lng, level, refreshCenter } = props.options;
        if (!state.map) {
            return ;
        }
        const { map, kakao } = state;
        // 지도 레벨이 10이상일때 animation없음.
        if (map.getLevel() > 10 || level == initMapLevel) {
            map.setCenter(new kakao.maps.LatLng(lat, lng));
        } else {
            setMapCenterSmooth(lat, lng, 300, () => {
                if (!isSimilarLocation({lat, lng}, {lat: map.getCenter().getLat(), lng: map.getCenter().getLng()})) {
                    // if failed to move center retry panto after 0.5s
                    setMapCenterSmooth(lat, lng, 500)
                }
            })
        }
    }, [props.options.lat, props.options.lng, props.options.refreshCenter]);

    useEffect(() => {
        const { level } = props.options;
        if (!state.map) {
            return ;
        }
        const { map, kakao } = state;
        if (map.getLevel() != level) {
            map.setLevel(level);
        }
    }, [props.options.level])

    const setMapCenterSmooth = (lat, lng, delay, callback=nullFunction) => {
        if (!state.map) {
            return ;
        }
        const { map, kakao } = state;
        setTimeout(() => {
            map.panTo(new kakao.maps.LatLng(lat, lng));
            if (callback) callback()
        }, delay);
    }

    useEffect(() => {
        const { bounds, boundMargins } = props.options;
        if (!state.map) {
            return ;
        }
        setLatLngBounds(state.map, state.kakao, bounds, boundMargins);
    }, [props.options.bounds]);

    return (
        <div className={props.className} id="kakao-map" ref={handleLoaded}>
            {state.map === null ? null : (
                <MapContext.Provider value={state}>
                    {props.children}
                </MapContext.Provider>
            )}
        </div>
    );
};

export default KakaoMap;