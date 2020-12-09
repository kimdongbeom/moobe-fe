import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {LoadingSpinner} from "components/common/layout/PresentUtil";
import Store from "components/mobile/store/Store";
import {fetchContentList} from "data/redux/action/content";
import {useLocation, useParams} from "react-router";
import SearchInfoHeader from "components/common/search/SearchInfoHeader";
import {_insert, buildMoobeMapBounds} from "data/util";
import queryString from "query-string";
import {isEmpty as _isEmpty} from "lodash";
import {MOBILE_CONTENT_LIST_LOADING} from "assets/styles/colors";
import LoadingOverlay from "react-loading-overlay";
import StoreAdSense from "components/google/StoreAdSense";
import {isEnableAdSense} from "assets/styles/const";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGrinTears} from "@fortawesome/free-regular-svg-icons";

const StoreListEmpty = () => (
    <div className="has-text-centered has-text-grey-light has-text-weight-semibold has-margin-top-10">
        <FontAwesomeIcon className="is-marginless has-text-grey-light has-text-weight-semibold has-margin-top-15"
                         icon={faGrinTears}
                         size={"3x"}/>
        <h1 className="title is-5 has-margin-top-20">
            <p>결과가 없어요...</p>
        </h1>
        <h3 className="title is-5 has-margin-top-15">
            <button className="button is-danger is-md" onClick={(e) => window.location.href='/'}>메인에서 다시 찾기</button>
        </h3>
    </div>
)

export const StoreList = ({isListVisible}) => {
    const {contentList, contentLoading, activeContent, pageSize, maxPage, totalCount} = useSelector(state => state.content);
    const [pageNum, setPageNum] = useState(1);
    const {channelList, channelLoading} = useSelector(state => state.channel);
    const {channelId, contentId} = useParams();
    const {query, searchType, swLat, swLng, neLat, neLng} = queryString.parse(useLocation().search);
    const mapBounds = buildMoobeMapBounds(swLat, swLng, neLat, neLng);
    const dispatch = useDispatch();
    const renderContentList = () => {
        if (_isEmpty(contentList)) {
            return <StoreListEmpty />
        }
        let storeList = contentList.map(content => {
            let channel = channelList.find(c => c.id == content.channelId)
            return <Store key={content.id} content={content} channel={channel} />
        })
        if (!isListVisible || !isEnableAdSense()) {
            return storeList;
        }
        const adCount = (storeList.length / 3).toFixed() * 1
        for (let i = adCount; i > 0; i--) {
            storeList = _insert(i*3, <StoreAdSense key={`ad-${i*3}`}/>, storeList)
        }
        return storeList
    };
    useEffect(() => {
        if (_isEmpty(contentList)) {
            setPageNum(1)
        }
    }, [contentList])
    const isLoadMore = () => !(contentList.length === totalCount);
    const loadMore = () => {
        dispatch(fetchContentList(channelId, query, searchType, mapBounds,  pageNum + 1, true, () => setPageNum(pageNum + 1)));
    };
    return (
        <>
            <SearchInfoHeader />
            {renderContentList()}
            <LoadingOverlay className={"store-loading-overlay"}
                active={channelLoading || contentLoading}
                spinner={<LoadingSpinner color={MOBILE_CONTENT_LIST_LOADING} loading={true}/>}>
                <div className={isLoadMore() ? "column box has-text-centered" : "is-hidden"} onClick={loadMore}><strong>더보기</strong></div>
            </LoadingOverlay>
        </>
    )
};


export default StoreList;