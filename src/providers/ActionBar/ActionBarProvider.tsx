import React, { createContext, useMemo, ReactNode } from "react";

const initalState: unknown = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    showBar: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    hideBar: () => {},
    store: {
        component: null,
        props: {},
    },
};

export const GlobalActionBarContext = createContext(initalState);

interface ActionBarProviderProps {
    children: ReactNode;
}

const ActionBarProvider: React.FC<ActionBarProviderProps> = ({ children }) => {
    const [store, setStore] = React.useState<{
        component: ReactNode;
        props?: unknown;
    }>({ component: null, props: {} });
    const value = useMemo(
        () => ({
            store,
            showBar: (component: ReactNode, props?: unknown) => {
                setStore({
                    component,
                    props,
                });
            },
            hideBar: () => {
                setStore({
                    component: null,
                    props: {},
                });
            },
        }),
        [store]
    );

    return (
        <GlobalActionBarContext.Provider value={value}>
            {children}
        </GlobalActionBarContext.Provider>
    );
};

export default ActionBarProvider;
