import { ReactNode } from "react";
import { Breakpoint, IconButton, SxProps } from "@mui/material";
import MuiDialog, {
    DialogClasses,
    DialogProps as MuiDialogProps,
} from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import useDialog from "@/hooks/useDialog";
import { CloseIcon } from "@/consts/icons";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";
import TooltipIcon from "../TooltipIcon";

export interface DialogProps {
    children: ReactNode;
    onClose?: (props: unknown) => void;
    title: string;
    titleTooltip?: string;
    maxWidth?: false | Breakpoint;
    titleSx?: SxProps;
    showCloseButton?: boolean;
    styleProps?: MuiDialogProps;
    classes?: Partial<DialogClasses>;
    keepMounted?: boolean;
    open?: boolean;
}

const Dialog = ({
    title,
    titleTooltip,
    styleProps,
    children,
    titleSx,
    showCloseButton = true,
    onClose,
    maxWidth = "tablet",
    classes,
    keepMounted,
    open = true,
}: DialogProps) => {
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const handleClose = (props: unknown) => {
        if (typeof onClose === "function") {
            onClose(props);
        }
        hideDialog();
    };

    const props: MuiDialogProps = {
        maxWidth,
        fullWidth: true,
        classes,
        keepMounted,
        open,
        ...styleProps,
    };

    return (
        <MuiDialog {...props} onClose={handleClose} keepMounted>
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
            {title && (
                <MuiDialogTitle sx={{ ...titleSx, pr: 6 }}>
                    {titleTooltip ? (
                        <TooltipIcon content={titleTooltip} label={title} />
                    ) : (
                        title
                    )}
                </MuiDialogTitle>
            )}
            {children}
        </MuiDialog>
    );
};

export default Dialog;
