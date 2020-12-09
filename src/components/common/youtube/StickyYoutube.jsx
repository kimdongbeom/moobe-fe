import React from "react";
import YouTube from "react-youtube";

const StickyYoutube = ({content, style, isSticky, distanceFromTop, calculatedHeight, setStickyInfo, fixedTop=false}) => {

    const updateStickyInfo = ({isSticky, calculatedHeight}) => {
        if(setStickyInfo) {
            setStickyInfo((originState) => {
                if (originState && originState.isSticky === isSticky && originState.calculatedHeight === calculatedHeight) {
                    //set state if state value changed
                    return originState;
                }
                return {
                    isSticky,
                    calculatedHeight
                }
            });
        }
    };

    updateStickyInfo({isSticky, calculatedHeight});
    let top = isSticky && fixedTop ? '0' : distanceFromTop;
    let zIndex = isSticky ? 10 : 0;
    return (
        <div style={{...style, top, zIndex}}>
            <YouTube
                videoId={content.videoLinkId}                  // defaults -> null
                id={content.videoLinkId}                       // defaults -> null
                className="youtube-container-mobile"                // defaults -> null
                containerClassName="column has-text-centered is-full is-marginless is-paddingless is-top-borderless"       // defaults -> ''
                opts={{playerVars: {playsinline: 1}}}
                // onReady={func}                    // defaults -> noop
                // onPlay={func}                     // defaults -> noop
                // onPause={func}                    // defaults -> noop
                // onEnd={func}                      // defaults -> noop
                // onError={func}                    // defaults -> noop
                // onStateChange={func}              // defaults -> noop
                // onPlaybackRateChange={func}       // defaults -> noop
                // onPlaybackQualityChange={func}    // defaults -> noop
            />
        </div>
    )
};

export default StickyYoutube;