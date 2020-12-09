import React from 'react';
import StoreList from "components/mobile/store/StoreList";

const MobileStoreList = ({isListVisible}) => {
    return (
        <>
            <div className="column is-full is-top-borderless">
                <StoreList isListVisible={isListVisible}/>
            </div>
        </>
    )
};

export default MobileStoreList;