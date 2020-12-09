import React, {useContext, useEffect, useState} from "react";
import {MapContext} from "components/common/map/KakaoMap";
import MarkerImageMd from "assets/images/marker_arrow_md.svg";
import MarkerImageLg from "assets/images/marker_arrow_lg.svg";
import {useDispatch} from "react-redux";
import {setMarkerClusterer} from "data/redux/action/map";

export const MarkerClustererContext = React.createContext({});
export const MarkerClustererCalculator = [50, 150]
export const MarkerClustererStyles = [{
    width : '60px', height : '60px',
    background: `url(${MarkerImageMd}) no-repeat`,
    backgroundSize: "60px 60px",
    fontWeight: 700,
    fontSize: "20px",
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: "62px",
    letterSpacing: "normal",
    textAlign: "center",
    color: "#ffffff"
},{
    width : '90px', height : '90px',
    background: `url(${MarkerImageLg}) no-repeat`,
    backgroundSize: "90px 90px",
    fontSize: "23px",
    fontWeight: 700,
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: '88px',
    letterSpacing: "normal",
    textAlign: "center",
    color: "#ffffff"
},{
    width : '90px', height : '90px',
    background: `url(${MarkerImageLg}) no-repeat`,
    backgroundSize: "90px 90px",
    fontSize: "26px",
    fontWeight: 800,
    fontStretch: "normal",
    fontStyle: "normal",
    lineHeight: '88px',
    letterSpacing: "normal",
    textAlign: "center",
    color: "#ffffff"
}]

const MarkerClusterer = props => {
    const { kakao, map } = useContext(MapContext);
    const [state, setState] = useState({
        clusterer: null
    });


    const dispatch = useDispatch();
    useEffect(() => {
        const { options, onClusterClick, isMain } = props;
        const clusterer = new kakao.maps.MarkerClusterer(options);
        clusterer.setMap(map);
        if (isMain) dispatch(setMarkerClusterer(clusterer))

        const clustered = () => {}
        const clusterClick = (cluster) => { if (onClusterClick) onClusterClick(cluster)};

        kakao.maps.event.addListener(clusterer, "clustered", clustered);
        kakao.maps.event.addListener( clusterer, 'clusterclick', clusterClick);
        setState({ clusterer });
        return () => {
            kakao.maps.event.removeListener(clusterer, "clustered", clustered);
            kakao.maps.event.removeListener(clusterer, 'clusterclick', clusterClick);
            clusterer.setMap(null);
        };
    }, []);

    useEffect(() => {
        const {
            gridSize,
            averageCenter,
            minLevel,
            disableClickZoom,
            texts,
            styles
        } = props.options;
        const { clusterer } = state;
        if (clusterer === null) return;
        if (gridSize) clusterer.setGridSize(gridSize);
        if (averageCenter) clusterer.setAverageCenter(averageCenter);
        if (minLevel) clusterer.setMinLevel(minLevel);
        if (texts) clusterer.setTexts(texts);
        if (styles) clusterer.setStyles(styles);
        // if (disableClickZoom) clusterer.setDisableClickZoom(disableClickZoom);
    }, [props.options]);

    if (state.clusterer === null) {
        return null;
    } else {
        return (
            <MarkerClustererContext.Provider value={state}>
                {state.clusterer === null ? null : props.children}
            </MarkerClustererContext.Provider>
        );
    }
};

export default MarkerClusterer;