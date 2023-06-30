import React, { createContext, useMemo, ReactNode } from "react";

type dialogComponentType = React.ElementType | null;
export type dialogPropsType = { [key: string]: ReactNode };

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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    showDialog: () => {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    hideDialog: () => {},
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

        // eslint-disable-next-line security/detect-object-injection
        const DialogComponent = store.dialogComponent;

        if (!DialogComponent) {
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
