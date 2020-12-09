import React from 'react';
import Numbers from "components/common/youtube/Numbers";
import Moment from "react-moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbsDown as fasThumbsDown, faThumbsUp as fasTumbsUp} from "@fortawesome/free-solid-svg-icons";
import {COMMENT_LIKED, COMMENT_UNLIKED, METRIC_THUMBS} from "assets/styles/colors";

export const YoutubeMetric = ({content}) => {
    return (
        <div className="columns is-marginless has-text-right">
            <div className="column has-text-left-desktop is-right-paddingless-desktop is-top-paddingless-mobile is-bottom-paddingless-mobile">
                <small className="has-padding-left-5 has-text-weight-semibold">
                    <ViewCountNumber content={content} />
                </small>
            </div>
            <div className="has-padding-like-column is-top-paddingless-mobile is-bottom-paddingless-mobile">
                <span className="has-padding-5">
                    <FontAwesomeIcon icon={fasTumbsUp} color={METRIC_THUMBS}/>
                </span>
                <span>
                     <Numbers shorten={true} shortenPrecision={1} shortFormatMinValue={1000}>{content.likeCount}</Numbers>
                </span>
                <span className="has-padding-left-15 has-padding-5">
                    <FontAwesomeIcon icon={fasThumbsDown} color={METRIC_THUMBS}/>
                </span>
                <span>
                     <Numbers shorten={true} shortenPrecision={1} shortFormatMinValue={1000}>{content.dislikeCount}</Numbers>
                 </span>
            </div>
        </div>
    );
}

export const YoutubeMetricVertical = ({content}) => {
    return (
        <div className="is-flex justify-center has-padding-15 has-text-right">
            <span className="flex-column align-items-center has-padding-5 has-padding-left-15 has-padding-right-15 has-text-centered">
                <FontAwesomeIcon size={"lg"} icon={fasTumbsUp} color={METRIC_THUMBS}/>
                <Numbers shorten={true} shortenPrecision={1} shortFormatMinValue={1000}>{content.likeCount}</Numbers>
            </span>
            <span className="flex-column align-items-center has-padding-5 has-padding-left-15 has-padding-right-15 has-text-centered">
                <FontAwesomeIcon size={"lg"}  icon={fasThumbsDown} color={METRIC_THUMBS}/>
                <Numbers shorten={true} shortenPrecision={1} shortFormatMinValue={1000}>{content.dislikeCount}</Numbers>
            </span>
        </div>
    )
}

export const ViewCountNumber = ({content}) => {
    return (
        <>
            <span className="video-view-count">
                <Numbers prefix="조회수 " postfix="회" shorten={false}>{content.viewCount}</Numbers>
            </span>
            <span className="video-date">
                {content.registerDate ? (<Moment format={'LL'}>{content.registerDate}</Moment>) : "알수 없음"}
            </span>
        </>
    )
}

export default YoutubeMetric;