import MuiDialog, { DialogProps } from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import React, { ReactNode } from "react";
import useDialog from "@/hooks/useDialog";
import { GlobalDialogContextProps } from "@/providers/Dialog/DialogProvider";
import { IconButton } from "@mui/material";
import { CloseIcon } from "@/consts/icons";
import ModalButtons from "@/components/ModalButtons";

export interface ModalProps {
    content?: ReactNode;
    onSuccess?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    title?: string;
    styleProps?: DialogProps;
}

const Modal = () => {
    const {
        hideDialog: hideModal,
        store: { dialogProps },
    } = useDialog() as GlobalDialogContextProps;

    const {
        content,
        onSuccess,
        onCancel,
        confirmText,
        cancelText,
        title,
        styleProps = {},
    } = dialogProps as unknown as ModalProps;

    const handleCancel = () => {
        if (typeof onCancel === "function") {
            onCancel();
        }
        hideModal();
    };

    const props: DialogProps = {
        maxWidth: "tablet",
        fullWidth: true,
        open: true,
        ...styleProps,
    };

    return (
        <MuiDialog {...props} onClose={handleCancel}>
            <IconButton
                data-testid="modal-close-icon"
                aria-label="close"
                onClick={handleCancel}
                sx={{
                    position: "absolute",
                    right: 8,
                    top: 8,
                    color: theme => theme.palette.grey[500],
                }}>
                <CloseIcon />
            </IconButton>
            <MuiDialogTitle>{title}</MuiDialogTitle>
            <MuiDialogContent>{content}</MuiDialogContent>
            <MuiDialogActions>
                <ModalButtons
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                    cancelText={cancelText}
                    confirmText={confirmText}
                />
            </MuiDialogActions>
        </MuiDialog>
    );
};

export default Modal;
