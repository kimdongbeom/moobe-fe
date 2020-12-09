import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {isEmpty as _isEmpty} from "lodash";
import {searchTypeList} from "data/redux/action/content";
import {buildContentPath, buildQuery, nullFunction} from "data/util";
import {useHistory} from "react-router";


const SearchBar = () => {
    const {activeChannel} = useSelector(state => state.channel);
    const [searchText, setSearchText] = useState("");
    const [isDropdownActive, setIsDropdownActive] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const {changedMapBounds} = useSelector(state => state.map);
    const history = useHistory();

    useEffect(() => {
        if (!isDropdownActive) {
            setFocusedIndex(0);
        }
    }, [isDropdownActive])

    const handleKeyDown = (e) => {
        // down 40 up 38 enter 13
        if (e.keyCode == 40) {
            setFocusedIndex((focusedIndex + 1) % 5);
            e.preventDefault()
        } else if (e.keyCode == 38) {
            setFocusedIndex((focusedIndex + 5 - 1) % 5);
            e.preventDefault()
        } else if (e.keyCode == 13) {
            search(focusedIndex);
            e.target.blur();
            e.preventDefault()
        }
    };

    const handleChange = (e) => {
        setSearchText(e.target.value)
        if (_isEmpty(e.target.value) || e.target.value.length <= 1) {
            setIsDropdownActive(false)
        } else {
            setIsDropdownActive(true)
        }
    }

    const handleBlur = (e) => {
        setTimeout(() => {
            setIsDropdownActive(false)
        }, 200)
    }

    const handleFocus = (e) => {
        if (!_isEmpty(searchText)) {
            setIsDropdownActive(true)
        }
    }

    const handleDropdownClick = (idx) => {
        search(idx);
    }

    const search = (idx) => {
        setIsDropdownActive(false)
        setSearchText("");
        history.push({
            pathname: buildContentPath(activeChannel, null),
            search: buildQuery({
                query: searchText,
                searchType: searchTypeList[idx].type,
                page: 1,
                swLat: changedMapBounds.sw.lat,
                swLng: changedMapBounds.sw.lng,
                neLat: changedMapBounds.ne.lat,
                neLng: changedMapBounds.ne.lng
            })
        });
    }


    return (
        <div className={"dropdown is-right is-full-width searchbar-dropdown " + (isDropdownActive ? "is-active" : "")}>
            <SearchBarText onFocus={handleFocus} className="is-flex is-full-width dropdown-trigger" onChange={handleChange} onKeyDown={handleKeyDown}
                           onBlur={handleBlur} value={searchText}/>
            <div className="dropdown-menu is-full-width is-paddingless" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    {searchTypeList.map((type, idx) => {
                        return (
                            <div key={type.type}
                                 className={"dropdown-item searchbar-dropdown-item text-overflow-ellipsis " + (focusedIndex === idx ? "is-active" : "")}
                                 onClick={() => handleDropdownClick(idx)}>
                                <span className="search-content-header">{type.title} </span>
                                :&nbsp;
                                <span className="has-text-link has-text-weight-bold">{searchText}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const SearchBarText = ({className, onChange=nullFunction, onKeyDown=nullFunction, onBlur=nullFunction, onFocus=nullFunction, value = ""}) => {
    return (
        <div className={className ? className : ""}>
            <SearchBarTextChannelAddon/>
            <div className="field is-full-width">
            <p className="control">
                <input className="input" type="search" value={value}
                       placeholder="주소, 음식, 태그, 제목으로 검색하실 수 있습니다."
                       onChange={onChange}
                       onKeyDown={onKeyDown}
                       onFocus={onFocus}
                       onBlur={onBlur}/>
            </p>
            </div>
        </div>
    )
};

const SearchBarTextChannelAddon = () => {
    const {activeChannel} = useSelector(state => state.channel);
    return (
        <>
            {activeChannel
                ? <p className="control">
                    <a className="button searchbar-addon is-static has-cursor-default"
                       style={{backgroundImage: `url(${activeChannel.profileImg})`, backgroundSize: "cover"}} />
                </p>
                : null}
        </>
    )
};

export default SearchBar;