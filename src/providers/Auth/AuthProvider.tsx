import { User } from "@/interfaces/User";
import React, { createContext, useMemo, ReactNode } from "react";

export const GlobalAuthContext = createContext({
    user: undefined,
    isLoggedIn: false,
});

interface AuthProviderProps {
    user?: User | undefined;
    children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ user, children }) => {
    const value = useMemo(
        () => ({
            user,
            isLoggedIn: !!user,
        }),
        [user]
    );

    return (
        <GlobalAuthContext.Provider value={value}>
            {children}
        </GlobalAuthContext.Provider>
    );
};

AuthProvider.defaultProps = {
    user: undefined,
};

export default AuthProvider;
