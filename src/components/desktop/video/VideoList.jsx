import React from 'react';
import {useSelector} from 'react-redux';
import {LoadingVideo} from "components/common/layout/PresentUtil";
import Video from "components/desktop/video/Video";
import {range as _range, isEmpty as _isEmpty} from 'lodash';
import {useHistory, useLocation} from "react-router";
import {_insert, buildQuery} from "data/util";
import SearchInfoHeader from "components/common/search/SearchInfoHeader";
import queryString from "query-string";
import VideoAdSense from "components/google/VideoAdSense";
import {GOOGLE_ADSENSE_CLIENT, GOOGLE_ADSENSE_CONTENT_SOLT, isEnableAdSense} from "assets/styles/const";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGrinTears} from "@fortawesome/free-regular-svg-icons";
import DesktopChannelNav from "components/desktop/video/DesktopChannelNav";
import AdSense from "react-adsense";

const LoadingList = <div className="column is-full">
        <LoadingVideo />
        <LoadingVideo />
        <LoadingVideo />
        <LoadingVideo />
        <LoadingVideo />
        <LoadingVideo />
    </div>;

const VideoListEmpty = () => (
    <div className="has-text-centered has-text-grey-light has-text-weight-semibold has-margin-top-50">
        <FontAwesomeIcon className="is-marginless has-text-grey-light has-text-weight-semibold has-margin-top-15"
                         icon={faGrinTears}
                         size={"4x"}/>
        <h1 className="title is-5 has-margin-top-20">
            <p>결과가 없어요...</p>
        </h1>
        <h3 className="title is-5 has-margin-top-15">
                <button className="button is-danger is-md" onClick={(e) => window.location.href='/'}>메인에서 다시 찾기</button>
        </h3>
    </div>
)

export const VideoList = () => {
    const {contentList, contentLoading, pageNum, pageSize, maxPage} = useSelector(state => state.content);
    const {channelList, channelLoading} = useSelector(state => state.channel);
    const pageGap = 2;
    const history = useHistory();
    const location = useLocation();

    const renderContentList = () => {
        if (_isEmpty(contentList)) {
            return <VideoListEmpty />
        }
        let videoList = contentList.map((content, idx) => {
                let channel = channelList.find(c => c.id == content.channelId)
                return <Video key={content.id} content={content} channel={channel} />
        });
        if (isEnableAdSense()) {
            videoList = _insert(6, <VideoAdSense key={'ad-6'}/>, videoList);
            videoList = _insert(3, <VideoAdSense key={'ad-3'}/>, videoList);
        }
        return  videoList;
    };


    const goPage = (i) => {
        history.push({
            pathname: location.pathname,
            search: buildQuery(Object.assign(queryString.parse(location.search), {page: i}))
        });
    };
    return (
        <>
            <SearchInfoHeader />
            {channelLoading || contentLoading? LoadingList : renderContentList()}
            {channelLoading || contentLoading || contentList.length === 0 ? null : <Pagination pageNum={pageNum} maxPage={maxPage} pageGap={pageGap} goPage={goPage} />}
            {/*<AdSense.Google*/}
            {/*    style={{width: "100%", maxHeight:"150px", display:"block"}}*/}
            {/*    client={GOOGLE_ADSENSE_CLIENT}*/}
            {/*    slot={GOOGLE_ADSENSE_CONTENT_SOLT}*/}
            {/*    format="horizontal"*/}
            {/*    responsive="true"*/}
            {/*/>*/}
        </>
    )
};

const Pagination = ({pageNum, maxPage, pageGap, goPage}) => (
    <div className="has-margin-top-10">
        <nav className="pagination" role="navigation" aria-label="pagination">
            <ul className="pagination-list justify-center">
                {pageNum - pageGap > 1 ? <li><a className="pagination-link" onClick={(e) => goPage(1)}>{1}</a></li> : null}
                {pageNum - pageGap > 2 ? <li><span className="pagination-ellipsis">&hellip;</span></li> : null}
                {_range(pageNum - pageGap > 1? pageNum - pageGap : 1, pageNum + pageGap < maxPage ? pageNum + pageGap + 1 : maxPage + 1).map(index => {
                    if (index === pageNum) {
                        return <li key={index}><a className="pagination-link is-current" aria-current="page">{index}</a></li>
                    } else {
                        return <li key={index}><a className="pagination-link" onClick={(e) => goPage(index)}>{index}</a></li>
                    }
                })}
                {pageNum + pageGap < maxPage - 1 ? <li><span className="pagination-ellipsis">&hellip;</span></li>  : null}
                {pageNum + pageGap < maxPage ? <li><a className="pagination-link" onClick={(e) => goPage(maxPage)}>{maxPage}</a></li>  : null}
            </ul>
        </nav>
    </div>
);
