import React, {useEffect} from 'react';
import MarkerArrow from 'assets/images/overlay_bottom_arrow.png';
import {useSelector} from "react-redux";
import {toString as _toString} from "lodash";
import {buildContentPath} from "data/util";
import {useHistory, useLocation, useParams} from "react-router";

const MapLocationOverlay = ({mapLocation, hasShadow=true, hoverShadow=false, showTag=true, showArrow=true, handleClick=null, handleMouseEnter=null, handleMouseLeave=null}) => {
    const {activeChannel} = useSelector(state => state.channel);
    const history = useHistory();
    const {contentId} = useParams();
    const location = useLocation();
    const updateActiveContent = (mapLocation) => {
        if (handleClick) {
            handleClick()
        } else {
            if (contentId !== _toString(mapLocation.id)) {
                history.push({
                    pathname: buildContentPath(activeChannel, mapLocation),
                    search: location.search
                });
            }
        }
    };

    const getShadowClassName = () => {
        let classNameList = [];
        if (hasShadow) classNameList.push("location-overlay-box-shadow")
        if (hoverShadow) classNameList.push("location-overlay-box-shadow-hover")
        return classNameList.join(" ")
    }

    const onMouseEnter = (e) => {
        if (handleMouseEnter) handleMouseEnter()
    }
    const onMouseLeave = (e) => {
        if (handleMouseLeave) handleMouseLeave()
    }

    return (
        <div className="has-cursor-pointer"
             onClick={(e) => updateActiveContent(mapLocation)}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}>
            <div className="card has-min-width-200 has-max-width-200 has-border-radius-6 white-space-normal has-text-left" >
                <div className={"card-content has-padding-10 has-text-weight-semibold " + getShadowClassName()}>
                    <p>{mapLocation.name}</p>
                    {showTag
                    ? <p>{mapLocation.tagList.map((tag, index) => <span key={mapLocation.name + tag + index} className="fa-0-87x has-text-link" >#{tag}</span>)}</p>
                    : null}
                </div>
            </div>
            {showArrow ? <img className="marker-arrow" src={MarkerArrow}/> : null}
        </div>
    )
};

export default MapLocationOverlay