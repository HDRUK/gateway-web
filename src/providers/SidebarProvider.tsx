"use client";

import {
    createContext,
    useMemo,
    ReactNode,
    useState,
    FC,
    ElementType,
} from "react";

type sidebarComponentType = ElementType | null;
export type sidebarPropsType = { [key: string]: unknown };

export interface GlobalSidebarContextProps {
    showSidebar?: (
        sidebarComponent: sidebarComponentType,
        sidebarProps?: sidebarPropsType
    ) => void;
    hideSidebar: () => void;
    store: {
        sidebarProps?: sidebarPropsType;
    };
}

const initalState: GlobalSidebarContextProps = {
    showSidebar: () => null,
    hideSidebar: () => null,
    store: {
        sidebarProps: {},
    },
};

export const GlobalSidebarContext = createContext(initalState);

interface GlobalSidebarProps {
    children: ReactNode;
}

const SidebarProvider: FC<GlobalSidebarProps> = ({ children }) => {
    const [store, setStore] = useState<{
        sidebarComponent: sidebarComponentType;
        sidebarProps?: sidebarPropsType;
    }>({ sidebarComponent: null, sidebarProps: {} });

    const renderComponent = () => {
        console.log("HERE IN SIDEBAR");
        if (!store.sidebarComponent) return null;

        const SidebarComponent = store.sidebarComponent;

        if (!SidebarComponent) {
            return null;
        }

        console.log("HERE IN SIDEBAR");

        return <SidebarComponent {...store.sidebarProps} />;
    };

    const value = useMemo(
        () => ({
            store,
            showSidebar: (
                sidebarComponent: sidebarComponentType,
                sidebarProps?: sidebarPropsType
            ) => {
                setStore({
                    sidebarComponent,
                    sidebarProps,
                });
            },
            hideSidebar: () => {
                setStore({
                    sidebarComponent: null,
                    sidebarProps: {},
                });
            },
        }),
        [store]
    );

    return (
        <GlobalSidebarContext.Provider value={value}>
            {renderComponent()}
            {children}
        </GlobalSidebarContext.Provider>
    );
};

export default SidebarProvider;
