import { createContext, useContext } from 'react';

export const AuthContext = createContext({
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
    return useContext(AuthContext);
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
