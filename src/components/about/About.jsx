import React from 'react';
import MoobeLogo from "assets/images/moobe_logo512.png";
import MoobeBrand from "assets/images/moobe_brand@x450.png";
import TermOfService from "components/about/Terms";

const About = () => (
    <div className="container">
        <div className="columns is-fullheight-with-navbar align-center">
            <div className="column is-three-fifths has-padding-25-mobile has-margin-top-100 has-margin-left-auto has-margin-right-auto">
                <div className="column box media has-padding-25-tablet has-padding-right-45-tablet has-padding-left-45-tablet">
                    <div className="is-flex has-padding-bottom-50">
                        <div style={{flexShrink: 1}} className="media-left has-margin-auto">
                            <figure className="image">
                                <img src={MoobeLogo} />
                            </figure>
                        </div>
                        <div className="media-content has-margin-auto">
                            <img className="image has-padding-left-30" src={MoobeBrand} />
                        </div>
                    </div>
                    <div className="has-text-right has-padding-bottom-10">
                        <p className="title is-4">인기 유투버가 다녀간 곳을 찾을 땐! 무브! Moobe!</p>
                        <p className="subtitle is-6">채널 연동 문의: <a className="is-link" href="mailto:beom.gary@gmail.com">beom.gary@gmail.com</a></p>
                        <TermOfService />
                    </div>
                </div>
                <footer className="has-text-right">
                    <div className="media justify-flex-end">
                        <div className="is-flex has-text-right align-items-flex-end">
                            <div className="media-content">
                                Moobe 2020 by <strong>Beom&Gary</strong>.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    </div>
)

export default About;