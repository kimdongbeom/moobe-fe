import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const OverlayFontAwesomeIcon = ({active, icon, color, transform, className, overlayIcon, overlayColor, overlayTransform, overlayClassName, reverse=false, children=null}) => {
    return (
        <span className="fa-layers fa-fw">
            {active && !reverse ? <FontAwesomeIcon icon={overlayIcon} color={overlayColor} transform={overlayTransform} className={overlayClassName}/> : null}
            <FontAwesomeIcon icon={icon} color={color} transform={transform} className={className}/>
            {active && reverse ? <FontAwesomeIcon icon={overlayIcon} color={overlayColor} transform={overlayTransform} className={overlayClassName}/> : null}
            {children ? children : null}
        </span>
    )
};

export default OverlayFontAwesomeIcon;