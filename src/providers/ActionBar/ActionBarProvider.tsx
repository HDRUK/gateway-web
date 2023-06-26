import React, { createContext, useMemo, ReactNode } from "react";

type componentType = React.ElementType | null;
export type propsType = { [key: string]: ReactNode | (() => void) };

export interface GlobalActionBarContextProps {
    showBar: (component: componentType, props?: propsType) => void;
    hideBar: () => void;
    store: {
        component: componentType;
        props?: propsType;
    };
}

const initalState: GlobalActionBarContextProps = {
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
        component: componentType;
        props?: propsType;
    }>({ component: null, props: {} });
    const value = useMemo(
        () => ({
            store,
            showBar: (component: componentType, props?: propsType) => {
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
