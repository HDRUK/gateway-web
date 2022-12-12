import React from 'react';

export const AuthContext = React.createContext({
    userState: [
        {
            loggedIn: false,
            role: 'Reader',
            id: null,
            name: null,
        },
    ],
});

export const useAuth = () => {
    return React.useContext(AuthContext);
};

export const withAuth = Component => {
    return props => {
        return (
            <AuthContext.Consumer>
                {value => {
                    return <Component {...props} userState={value.userState} />;
                }}
            </AuthContext.Consumer>
        );
    };
};

export const AuthProvider = AuthContext.Provider;
