import React, {useEffect} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearchLocation} from "@fortawesome/free-solid-svg-icons";
import {
    buildContentPath,
    buildQuery,
    getSearchQueryParams,
    getSearchQueryText,
    isSimilarLocation,
    updateObject
} from "data/util";
import {useHistory, useLocation} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {isEmpty as _isEmpty} from "lodash";
import queryString from "query-string";
import {setSearchOnBoundChange} from "data/redux/action/map";
import {setFocusedLocation} from "data/redux/action/location";

const SearchWideLocationButton = () => {

    const dispatch = useDispatch();
    const {contentList, contentLoading} = useSelector(state => state.content);
    const {map} = useSelector(state => state.map);
    const {query, searchType} = queryString.parse(useLocation().search);

    const search = () => {
        dispatch(setFocusedLocation(null))
        dispatch(setSearchOnBoundChange(true))
        map.setLevel(map.getLevel() + 1, {
            animate: {
                duration: 200
            }
        })
    };

    const searchWideLocationText = () => {
        if (!_isEmpty(query)) {
            return "더 넓은 범위에서 [" + getSearchQueryText(query, searchType) + "] 다시 찾기";
        }
        return "더 넓은 범위에서 찾기"
    }
    const isVisible = !contentLoading && contentList.length == 0

    return (
        <button className={"location-search-button button is-link " + (isVisible ? "" : "is-hidden")} onClick={search}>
            <span className="icon">
                <FontAwesomeIcon icon={faSearchLocation} size={"sm"} />
            </span>
            <span>{searchWideLocationText()}</span>
        </button>
    )
};

export default SearchWideLocationButton;