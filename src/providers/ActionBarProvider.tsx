"use client";

import React, { createContext, useMemo, ReactNode } from "react";
import { isEqual } from "lodash";
import { ModalButtonProps } from "@/components/ModalButtons/ModalButtons";

type ActionBarProps = {
    [key: string]: unknown | ReactNode;
} & ModalButtonProps & {
        component?: React.ComponentType<unknown> | null;
    };

export interface GlobalActionBarContextProps {
    showBar: (name: string, props: ActionBarProps) => void;
    updateStoreProps: (props: { [key: string]: ReactNode }) => void;
    hideBar: () => void;
    store: {
        name: string;
        isVisible: boolean;
        props: ActionBarProps;
    };
}

const initalState: GlobalActionBarContextProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    updateStoreProps: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    showBar: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    hideBar: () => {},
    store: {
        name: "",
        isVisible: false,
        props: {},
    },
};

export const GlobalActionBarContext = createContext(initalState);

interface ActionBarProviderProps {
    children: ReactNode;
}

const ActionBarProvider: React.FC<ActionBarProviderProps> = ({ children }) => {
    const [store, setStore] = React.useState<{
        name: string;
        isVisible: boolean;
        props: ActionBarProps;
    }>({ name: "", isVisible: false, props: {} });

    const value = useMemo(
        () => ({
            store,
            updateStoreProps: (updatedProps: { [key: string]: ReactNode }) => {
                const updatedStore = {
                    ...store,
                    props: { ...store.props, ...updatedProps },
                };
                if (isEqual(store, updatedStore)) return;
                setStore(updatedStore);
            },
            showBar: (name: string, props: ActionBarProps) => {
                setStore({
                    name,
                    isVisible: true,
                    props,
                });
            },
            hideBar: () => {
                setStore({
                    name: "",
                    isVisible: false,
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
