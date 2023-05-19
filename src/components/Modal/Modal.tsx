import MuiModal from "@mui/material/Modal";
import React, { ReactNode } from "react";
import useDialog from "@/hooks/useDialog";
import { GlobalDialogContextProps } from "@/providers/Dialog/DialogProvider";
import Button from "../Button";

export interface ModalProps {
    bodyContent: ReactNode;
    onSuccess: () => void;
    confirmText?: string;
    cancelText?: string;
    title: string;
}

const Modal = () => {
    const {
        hideDialog: hideModal,
        store: { dialogProps },
    } = useDialog() as GlobalDialogContextProps;

    const { bodyContent, onSuccess, confirmText, cancelText, title } =
        dialogProps as unknown as ModalProps;

    const handleSuccess = () => {
        onSuccess();
        hideModal();
    };

    return (
        <MuiModal title={title} open onClose={hideModal}>
            <>
                {bodyContent}
                <Button key="confirm" onClick={handleSuccess}>
                    {confirmText || "Confirm"}
                </Button>
                <Button key="cancel" color="secondary" onClick={hideModal}>
                    {cancelText || "Cancel"}
                </Button>
            </>
        </MuiModal>
    );
};

export default Modal;
