import React from 'react';
import {Route, Switch} from "react-router";
import MetaRegistForm from "components/admin/MetaRegistForm";
import MoobeHome from "components/home/Home";
import MoobeNavBar from "components/common/layout/Navbar";
import Favorite from "components/favorite/Favorite";
import {concat as _concat} from "lodash";
import {faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    aboutPage,
    aboutPagePaths,
    contentDetailPagePaths,
    contentListPagePaths,
    contentPage,
    favoritePage,
    favoritePagePaths
} from "data/router-util";
import About from "components/about/About";


const withoutNavbar = BaseComponent => (
    <>
        <section className="hero is-fullheight">
            <div className="hero-body align-items-flex-start">
                <section className="container">
                    <BaseComponent />
                </section>
            </div>
        </section>
    </>
);

const withNavbar = (BaseComponent, pageType) => {
    return (
        <>
            <MoobeNavBar type={pageType}/>
            <section className="hero is-fullheight-with-navbar is-fullheight-with-navbar-mobile">
                <div className="hero-body is-paddingless">
                    <section className="is-full-width">
                        <BaseComponent/>
                    </section>
                </div>
            </section>
        </>
    )
};

const MoobeBody = () => {
    return (
        <>
            <Switch>
                {/*<Route exact path="/login" >*/}
                {/*    {withoutNavbar(MoobeLogin)}*/}
                {/*</Route>*/}
                <Route exact path="/admin" >
                    {withoutNavbar(MetaRegistForm)}
                </Route>
                <Route exact path={_concat(contentListPagePaths, contentDetailPagePaths)}>
                    {withNavbar(MoobeHome, contentPage)}
                </Route>
                <Route exact path={favoritePagePaths}>
                    {withNavbar(Favorite, favoritePage)}
                </Route>
                <Route exact path={aboutPagePaths}>
                    {withNavbar(About, aboutPage)}
                </Route>
                <Route>
                    {withNavbar(NotFound)}
                </Route>
            </Switch>
        </>

    )
};

const NotFound = () => (
    <div className="container">
        <div className="column is-fullheight-with-navbar has-text-centered">
            <FontAwesomeIcon className="is-marginless has-text-grey-light has-text-weight-semibold has-margin-top-100"
                             icon={faExclamationTriangle}
                             size={"9x"}/>
            <h1 className="title is-3 has-margin-top-25">
                <p>요청하신 페이지를 찾을 수 없습니다.</p>
            </h1>
            <h3 className="title is-5 has-margin-top-15">
                <button className="button is-danger is-large" onClick={(e) => window.location.href='/'}>Moobe 메인으로</button>
            </h3>
        </div>
    </div>
)

export default MoobeBody;