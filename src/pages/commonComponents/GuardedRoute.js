import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const GuardedRoute = ({ component: Component, ...rest }) => {
    // deconstruct out the rest of the props
    const { userState = [], path } = { ...rest };
    // get the user record
    const [user] = userState;
    // setup auth value for testing authed route
    const { loggedIn: auth } = user;
    return (
        <Route
            path={path}
            render={props => (auth === true ? <Component {...props} userState={userState} /> : <Redirect to='/search?search=' />)}
        />
    );
};
