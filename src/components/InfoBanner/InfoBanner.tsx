"use client";

import { useState } from "react";
import { Close } from "@mui/icons-material";
import { IconButton, Snackbar, SnackbarProps, useTheme } from "@mui/material";

export interface InfoBannerProps extends Omit<SnackbarProps, "color"> {
    color?:
        | "primary"
        | "secondary"
        | "warning"
        | "success"
        | "info"
        | "error"
        | "greyCustom";
    ariaCloseButtonLabel: string;
    isDismissable?: boolean;
}

const InfoBanner = ({
    sx,
    color = "primary",
    action,
    anchorOrigin = {
        vertical: "top",
        horizontal: "center",
    },
    isDismissable = true,
    ariaCloseButtonLabel,
    ...restProps
}: InfoBannerProps) => {
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    return (
        <Snackbar
            action={
                <>
                    {action}
                    {isDismissable && (
                        <IconButton
                            onClick={() => setOpen(false)}
                            aria-label={ariaCloseButtonLabel}>
                            <Close
                                sx={{
                                    color: theme.palette[color].contrastText,
                                }}
                            />
                        </IconButton>
                    )}
                </>
            }
            ContentProps={{
                sx: {
                    background: theme.palette[color].dark,
                },
            }}
            anchorOrigin={anchorOrigin}
            sx={{
                position: "static",
                "> div": {
                    borderRadius: 0,
                },
                ...sx,
            }}
            open={open}
            {...restProps}
        />
    );
};

export default InfoBanner;
