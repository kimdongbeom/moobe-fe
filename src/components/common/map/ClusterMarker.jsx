import React from "react";
import {useDispatch, useSelector} from "react-redux";
import MarkerClusterer, {MarkerClustererStyles} from "components/common/map/MarkerClusterer";
import Marker from "components/common/map/Marker";
import {setMapBounds, setSearchOnBoundChange} from "data/redux/action/map";
import {resetClusterLocationData} from "data/redux/action/clusterLocation";
import {mapBoundsMargin} from "data/redux/reducers/mapReducer";

const ClusterMarker = ({mapClusterLocation, renderFocusedMarker, renderSingleMarker}) => {
    const {map} = useSelector(state => state.map);
    const {focusedMapLocation} = useSelector(state => state.mapLocation);
    const dispatch = useDispatch();

    const getClusterStyle = () => {
        let clusterStyle;
        if (mapClusterLocation.markerListSize > 150) {
            clusterStyle = Object.assign({}, MarkerClustererStyles[2]);
        } else if (mapClusterLocation.markerListSize > 50) {
            clusterStyle = Object.assign({}, MarkerClustererStyles[1]);
        } else {
            clusterStyle = Object.assign({}, MarkerClustererStyles[0]);
        }
        return [clusterStyle]
    }

    const getText = () => {
        return [mapClusterLocation.markerListSize];
    }

    const onClusterClick = (cluster) => {
        if (map) {
            const latLngList = mapClusterLocation.locationList.map(m => {
                return {lat: m.latitude, lng: m.longitude}
            });
            dispatch(setSearchOnBoundChange(true));
            dispatch(resetClusterLocationData());
            dispatch(setMapBounds(latLngList, mapBoundsMargin));
        }
    }

    return (
        <>
            {mapClusterLocation.markerListSize == 1
                ? renderSingleMarker(mapClusterLocation)
                : <MarkerClusterer options={{
                    minLevel: 0,
                    disableClickZoom: true,
                    minClusterSize: 1,
                    styles: getClusterStyle(),
                    texts: getText(),
                }} onClusterClick={onClusterClick}>
                    <Marker options={{lat: mapClusterLocation.centerLatitude, lng: mapClusterLocation.centerLongitude, content: mapClusterLocation.markerListSize,}} />
                    {focusedMapLocation && mapClusterLocation.locationIdList.includes(focusedMapLocation.id)
                        ? renderFocusedMarker(mapClusterLocation.findLocation(focusedMapLocation.id))
                        : null
                    }
                </MarkerClusterer>
            }
        </>
    )
}

export default ClusterMarker;