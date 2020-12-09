import React, {useCallback, useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp, faTimes} from "@fortawesome/free-solid-svg-icons";
import MarkerArrow from 'assets/images/overlay_bottom_arrow.png';
import {useDispatch} from "react-redux";
import {setShowOverlayContentDetail} from "data/redux/action/contentDetail";
import NaverIco from "assets/images/naver.png";

const DetailContentOverlay = ({content, visible}) => {
    const [showMore, setShowMore] = useState(false);
    const [isOverflow, setIsOverflow] = useState(false);
    const dispatch = useDispatch();
    const store = content.store

    const updateOverflow = useCallback(node => {
        if (node) {
            let cardContent = node.getElementsByClassName("card-content");
            setIsOverflow(cardContent[0].clientHeight > 350);
        }
    }, []);
    useEffect(() => {
        setShowMore(false)
    }, [visible]);

    const toggleShowMore = () => setShowMore(!showMore);
    const overlayDivClassName = () => showMore
        ? "card has-width-350 white-space-normal overflow-hidden has-cursor-default"
        : "card has-width-350 has-height-250 white-space-normal overflow-hidden has-cursor-default";
    const moreIcon = () => showMore? faAngleUp : faAngleDown;
    const moreIconClassName = () => !isOverflow ? "is-hidden" : showMore?  'hide-more' : 'show-more';
    const markerArrowClassName = () => showMore? 'marker-arrow is-hidden' : 'marker-arrow';
    const openUrl = (e) => {
        window.open(store.link, "_blank");
    };
    const closeOverlay = () => {
        dispatch(setShowOverlayContentDetail(false))
    };

    return (
        <div ref={updateOverflow}>
            <div className={overlayDivClassName()} >
                <FontAwesomeIcon className="close-overlay" icon={faTimes} size={'1x'} onClick={closeOverlay} />
                <div className="card-content">
                    <p><span className="title is-size-5 is-family-sans-serif">{store.name}</span></p>
                    <hr className="has-margin-top-5 has-margin-bottom-5 has-background-black-bis"/>
                    {store.link
                    ? <div className="has-text-right"><img src={NaverIco} className="image is-inline is-24x24 vertical-align-top clickable" onClick={openUrl}/></div>
                    : null}

                    <div className="content is-family-sans-serif">
                        <p className="is-size-6 has-margin-bottom-5">{store.address1}</p>
                        <p className="is-size-6 has-margin-bottom-10"><span className="tag is-info is-rounded is-normal has-text-weight-bold has-margin-right-5">지번</span>{store.address2}</p>
                        <p className="is-size-7 has-margin-bottom-5 has-text-link">{store.tel}</p>
                        <p className="is-size-7 has-margin-bottom-5">{store.availableTime}</p>
                    </div>
                </div>
                <FontAwesomeIcon className={moreIconClassName()} icon={moreIcon()} size={'2x'} onClick={toggleShowMore}/>
            </div>
            <img className={markerArrowClassName()} src={MarkerArrow}/>
        </div>
    )
};

export default DetailContentOverlay