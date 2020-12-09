import React from 'react';
import MoobeBrand from 'assets/images/moobe_brand.svg';
import GoogleButton from "react-google-button";


const MoobeLogin = () => {
    return (
        <div className="card has-max-width-350 has-margin-auto is-shadowless">
            <div className="card-image">
                <figure className="image is-by is-4by3">
                    <img src={MoobeBrand}/>
                </figure>
            </div>
            <div className="card-content">
                <GoogleButton className="is-fullwidth"
                              type="light"
                              label='Google 계정으로 로그인하기'
                              onClick={(e) => console.log("click google login")}/>
            </div>
        </div>
    )
};

export default MoobeLogin;
