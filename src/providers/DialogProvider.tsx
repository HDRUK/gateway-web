"use client";

import React, { createContext, useMemo, ReactNode } from "react";

type dialogComponentType = React.ElementType | null;
export type dialogPropsType = { [key: string]: unknown };

export interface GlobalDialogContextProps {
    showDialog: (
        dialogComponent: dialogComponentType,
        dialogProps?: dialogPropsType
    ) => void;
    hideDialog: () => void;
    store: {
        dialogComponent: dialogComponentType;
        dialogProps?: dialogPropsType;
    };
}

const initalState: GlobalDialogContextProps = {
    showDialog: () => null,
    hideDialog: () => null,
    store: {
        dialogComponent: null,
        dialogProps: {},
    },
};

export const GlobalDialogContext = createContext(initalState);

interface GlobalDialogProps {
    children: ReactNode;
}

const DialogProvider: React.FC<GlobalDialogProps> = ({ children }) => {
    const [store, setStore] = React.useState<{
        dialogComponent: dialogComponentType;
        dialogProps?: dialogPropsType;
    }>({ dialogComponent: null, dialogProps: {} });

    const renderComponent = () => {
        if (!store.dialogComponent) return null;

        const DialogComponent = store.dialogComponent;

        if (!DialogComponent || store.dialogProps?.isProvidersDialog) {
            return null;
        }

        return <DialogComponent {...store.dialogProps} />;
    };

    const value = useMemo(
        () => ({
            store,
            showDialog: (
                dialogComponent: dialogComponentType,
                dialogProps?: dialogPropsType
            ) => {
                setStore({
                    dialogComponent,
                    dialogProps,
                });
            },
            hideDialog: () => {
                setStore({
                    dialogComponent: null,
                    dialogProps: {},
                });
            },
        }),
        [store]
    );

    return (
        <GlobalDialogContext.Provider value={value}>
            {renderComponent()}
            {children}
        </GlobalDialogContext.Provider>
    );
};

export default DialogProvider;
