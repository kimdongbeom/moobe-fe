import React from 'react';
import Skeleton, {SkeletonTheme} from "react-loading-skeleton";
import {BarLoader, BounceLoader, ScaleLoader} from "react-spinners";
import {
    CONTENT_LOADING,
    CONTENT_LOADING_HIGHLIGHT,
    MAP_GEOLOCATION_DISABLE,
    MAP_GEOLOCATION_ENABLE
} from "assets/styles/colors";
import {faCrosshairs, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const LoadingVideo = props => <SkeletonTheme color={CONTENT_LOADING} highlightColor={CONTENT_LOADING_HIGHLIGHT}>
    <div className="columns is-full is-mobile">
        <div className="column is-two-fifths">
            <Skeleton height={60}/>
        </div>
        <div className="column is-three-fifths">
            <Skeleton count={4}/>
        </div>
    </div>
</SkeletonTheme>

export const LoadingStore = props => <SkeletonTheme color={CONTENT_LOADING} highlightColor={CONTENT_LOADING_HIGHLIGHT}>
    <div className="row">
        <div className="column">
            <Skeleton height={160}/>
        </div>
        <div className="column">
            <Skeleton count={5}/>
        </div>
    </div>
</SkeletonTheme>

export const LoadingFavorite = props => <SkeletonTheme color={CONTENT_LOADING} highlightColor={CONTENT_LOADING_HIGHLIGHT}>
    <div className="row">
        <div className="column">
            <Skeleton height={160}/>
        </div>
        <div className="column">
            <Skeleton count={2}/>
        </div>
    </div>
</SkeletonTheme>

export const LoadingBouncer = ({color, loading}) => (
    <div className="has-text-centered has-padding-bottom-10">
            <BounceLoader
                css={`margin: 0 auto;`}
                className="has-margin-auto"
                size={50} // or 150px
                color={color}
                loading={loading}
            />
    </div>
);

export const LoadingSpinner = ({color, loading}) => (
    <div>
        <FontAwesomeIcon className={loading ? "fast-spin" : ""}
                         icon={faSpinner}
                         color={color}
                         size={"lg"}/>
    </div>
)

export const LoadingScale = ({color, loading}) => (
    <div>
        <ScaleLoader
            height={35}
            width={6}
            radius={45}
            margin={'3px'}
            color={color}
            loading={loading}
        />
    </div>
)

export const MapLoadingSpinner = ({color, loading}) => (
    <div className="has-text-centered has-padding-bottom-10">
            <BarLoader

                size={50} // or 150px
                color={color}
                loading={loading}
            />
    </div>

)