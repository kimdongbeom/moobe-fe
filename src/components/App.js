import React, {useEffect} from 'react';
import MoobeHeader from 'components/common/layout/Header';
import MoobeBody from "components/common/layout/Body";
import withGA from "components/google/Analytics";

const App = (props) => {
    useEffect(() => {
        if (process.env.REACT_APP_ENV !== 'real') {
            console.log("process.env ", process.env)
        }
    }, [])
    return (
        <section className="hero">
            <MoobeHeader />
            <MoobeBody />
        </section>
    );
}

export default withGA(App);
