import { ReactNode, useEffect, useState } from "react";
import { Box, Drawer, DrawerProps, IconButton } from "@mui/material";
import { DialogProps } from "@mui/material/Dialog";
import MuiDialogTitle from "@mui/material/DialogTitle";
import useDialog from "@/hooks/useDialog";
import { colors } from "@/config/theme";
import { CloseIcon } from "@/consts/icons";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

export interface SidebarProps {
    content?: ReactNode;
    onSuccess?: () => void;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    showConfirm?: boolean;
    title?: string;
    invertCloseIconBehaviour?: boolean;
    styleProps?: DialogProps;
    tertiaryButton?: { onAction: (props: unknown) => void; buttonText: string };
}

const Sidebar = () => {
    const { hideDialog: hideSidebar, store } =
        useDialog() as GlobalDialogContextProps;

    const {
        content,
        title,
        styleProps = {},
    } = store.dialogProps as unknown as SidebarProps;

    const handleClose = () => {
        hideSidebar();
    };

    const [open, setOpen] = useState(false);

    const props: DrawerProps = {
        open: open,
        role: "presentation",
        anchor: "right",
        ...styleProps,
    };

    useEffect(() => {
        setOpen(true);
    }, []);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);

        if (!newOpen) {
            setTimeout(() => {
                // todo - can this be reaplcesd
                handleClose();
            }, 400);
        }
    };

    return (
        <Drawer onClose={toggleDrawer(false)} {...props}>
            <Box sx={{ width: "70vw" }} role="presentation">
                <Box
                    sx={{
                        backgroundColor: colors.purple700,
                        height: 60,
                        display: "flex",
                        WebkitAlignItems: "center",
                        color: colors.white,
                    }}>
                    <MuiDialogTitle>{title}</MuiDialogTitle>
                    <IconButton
                        data-testid="modal-close-icon"
                        aria-label="close"
                        onClick={toggleDrawer(false)}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: colors.white,
                        }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {content}
            </Box>
        </Drawer>
    );
};

export default Sidebar;
