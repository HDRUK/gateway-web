"use client";

import React, { FC, ReactNode, createContext, useMemo } from "react";

export interface GlobalSignInContextProps {
    showDialog: () => void;
    hideDialog: () => void;
    store: {
        isVisible: boolean;
    };
}

const initalState: GlobalSignInContextProps = {
    showDialog: () => null,
    hideDialog: () => null,
    store: {
        isVisible: false,
    },
};

interface Test {
    children: ReactNode;
}

export const GlobalSignInContext = createContext(initalState);

const SignInProvider: FC<Test> = ({ children }) => {
    const [store, setStore] = React.useState<{
        isVisible: boolean;
    }>({ isVisible: false });

    const value = useMemo(
        () => ({
            store,
            showDialog: () => {
                setStore({
                    isVisible: true,
                });
            },
            hideDialog: () => {
                setStore({
                    isVisible: false,
                });
            },
        }),
        [store]
    );

    return (
        <GlobalSignInContext.Provider value={value}>
            {children}
        </GlobalSignInContext.Provider>
    );
};

export default SignInProvider;
