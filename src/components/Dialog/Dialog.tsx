import MuiDialog, { DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import React, { ReactNode } from "react";
import useDialog from "@/hooks/useDialog";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";
import { IconButton, SxProps } from "@mui/material";
import { CloseIcon } from "@/consts/icons";

export interface DialogProps {
    children: ReactNode;
    onClose?: (props: unknown) => void;
    title: string;
    titleSx?: SxProps;
    showCloseButton?: boolean;
    styleProps?: MuiDialogProps;
}

const Dialog = ({
    title,
    styleProps,
    children,
    titleSx,
    showCloseButton = true,
    onClose,
}: DialogProps) => {
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const handleClose = (props: unknown) => {
        if (typeof onClose === "function") {
            onClose(props);
        }
        hideDialog();
    };

    const props: MuiDialogProps = {
        maxWidth: "tablet",
        fullWidth: true,
        open: true,
        ...styleProps,
    };

    return (
        <MuiDialog {...props} onClose={handleClose}>
            {showCloseButton && (
                <IconButton
                    data-testid="dialog-close-icon"
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme => theme.palette.grey[500],
                    }}>
                    <CloseIcon />
                </IconButton>
            )}
            <MuiDialogTitle sx={{ ...titleSx }}>{title}</MuiDialogTitle>
            {children}
        </MuiDialog>
    );
};

export default Dialog;
