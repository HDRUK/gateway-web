import { ModalButtonProps } from "@/components/ModalButtons/ModalButtons";
import React, { createContext, useMemo, ReactNode } from "react";

type ActionBarProps = { [key: string]: unknown } & ModalButtonProps & {
        component?: React.ElementType | null;
    };

export interface GlobalActionBarContextProps {
    showBar: (name: string, props: ActionBarProps) => void;
    hideBar: () => void;
    store: {
        name: string;
        props: ActionBarProps;
    };
}

const initalState: GlobalActionBarContextProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    showBar: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    hideBar: () => {},
    store: {
        name: "",
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
        props: ActionBarProps;
    }>({ name: "", props: {} });

    const value = useMemo(
        () => ({
            store,
            showBar: (name: string, props: ActionBarProps) => {
                setStore({
                    name,
                    props,
                });
            },
            hideBar: () => {
                setStore({
                    name: "",
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
