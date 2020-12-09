import React from "react";
import {useSelector} from "react-redux";
import {buildContentPath, buildQuery, getSearchQueryText} from "data/util";
import queryString from "query-string";
import {useHistory, useLocation} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {isEmpty as _isEmpty} from "lodash";

const SearchInfoHeader = () => {
    const {activeChannel} = useSelector(state => state.channel);
    const {totalCount} = useSelector(state => state.content);
    const {changedMapBounds} = useSelector(state => state.map);
    const {query, searchType, page, swLat, swLng, neLat, neLng} = queryString.parse(useLocation().search);
    const history = useHistory();
    const getSearchText = () => {
        return getSearchQueryText(query, searchType);
    }
    const resetSearch = () => {
        history.push({
            pathname: buildContentPath(activeChannel, null),
            search: buildQuery({page: 1, swLat: changedMapBounds.sw.lat, swLng: changedMapBounds.sw.lng, neLat: changedMapBounds.ne.lat, neLng: changedMapBounds.ne.lng})
        });
    }

    const renderCurrentQuery = () => {
        if (!_isEmpty(query)) {
            return (
                <span className="is-pulled-left">
                    {getSearchText()}
                    <FontAwesomeIcon className="has-padding-left-5 has-text-grey-light clickable" icon={faTimes} size={'lg'} onClick={resetSearch} />
                </span>
            )
        } else {
            return null;
        }
    }
    return (
        <>
            <div className="columns is-mobile is-marginless has-text-weight-semibold text-smaller">
                <div className="column is-half is-paddingless">
                    {renderCurrentQuery()}
                </div>
                <div className="column is-half is-paddingless">
                    <span className="is-pulled-right">전체 {totalCount}개</span>
                </div>
            </div>
        </>
    )
};

export default SearchInfoHeader;