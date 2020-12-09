import React, {useState} from "react";
import {useSelector} from "react-redux";
import {chunk as _chunk, range as _range, isEmpty as _isEmpty} from 'lodash';
import {uuid} from "bulma-extensions/bulma-calendar/src/js/utils";
import {EmptyFavoriteContent, FavoriteContentEmpty, getFavoriteContentWithAdSense} from "components/favorite/Favorite";
import {useHistory} from "react-router";
import {buildContentPath} from "data/util";
import {LoadingFavorite} from "components/common/layout/PresentUtil";

export const Loading = () => (
    <div className="tile is-ancestor is-borderless">
        <div className="card tile is-parent is-borderless is-shadowless">
            <div className="tile is-child box is-shadowless">
                <LoadingFavorite />
            </div>
        </div>
        <div className="card tile is-parent is-borderless is-shadowless">
            <div className="tile is-child box is-shadowless">
                <LoadingFavorite />
            </div>
        </div>
        <div className="card tile is-parent is-borderless is-shadowless">
            <div className="tile is-child box is-shadowless">
                <LoadingFavorite />
            </div>
        </div>
        <div className="card tile is-parent is-borderless is-shadowless">
            <div className="tile is-child box is-shadowless">
                <LoadingFavorite />
            </div>
        </div>
    </div>
);

const DesktopFavorite = () => {
    const {favoriteChannelList} = useSelector(state => state.favoriteChannel);
    const [chunkCount, setChunkCount] = useState(4);
    const {favoriteContentList, favoriteContentLoading} = useSelector(state => state.favoriteContent);
    const history = useHistory();

    const getFavoriteContents = () => {
        let contentList = getFavoriteContentWithAdSense(
            favoriteContentList,
            favoriteChannelList,
            5,
            "square",
            (channel, content) => {
                history.push({
                    pathname: buildContentPath(channel, content)
                });
            });

        const emptyFavoriteCount = chunkCount - contentList.length % chunkCount
        return contentList.concat(_range(emptyFavoriteCount).map(idx => <EmptyFavoriteContent key={`empty-${idx}`} />))
    }

    const renderFavoriteContents = () => {
        if (_isEmpty(favoriteContentList)) {
            return <FavoriteContentEmpty />
        } else {
            return _chunk(getFavoriteContents(), chunkCount).map(chunkList =>
                <div key={uuid()} className="tile is-ancestor is-borderless is-marginless">
                    {chunkList}
                </div>
            )
        }
    }

    return (
        <div className="container">
            <div className="column is-fullheight-with-navbar is-paddingless">
                {favoriteContentLoading
                    ? <><Loading /><Loading /></>
                    : renderFavoriteContents()}
            </div>
        </div>
    )
};

export default DesktopFavorite;