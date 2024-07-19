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
    // test: boolean;
    // showProvidersDialog: () => void;
    // hideProvidersDialog: () => void;
}

const initalState: GlobalDialogContextProps = {
    showDialog: () => null,
    hideDialog: () => null,
    // test: false,
    store: {
        dialogComponent: null,
        dialogProps: {},
    },

    // showProvidersDialog: () => null,
    // hideProvidersDialog: () => null,
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

    // const [test, setTest] = React.useState<boolean>(true);

    const renderComponent = () => {
        if (!store.dialogComponent) return null;

        const DialogComponent = store.dialogComponent;

        if (!DialogComponent) {
            return null;
        }

        return <DialogComponent {...store.dialogProps} />;
    };

    const value = useMemo(
        () => ({
            store,
            // test,
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

            // showProvidersDialog: () => {
            //     setTest(false);
            // },
            // hideProvidersDialog: () => {
            //     setTest(true);
            // },
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
