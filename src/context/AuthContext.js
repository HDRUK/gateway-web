import React from 'react';

export const AuthContext = React.createContext({});

export const useAuth = () => {
    return React.useContext(AuthContext);
};

export const AuthProvider = AuthContext.Provider;
