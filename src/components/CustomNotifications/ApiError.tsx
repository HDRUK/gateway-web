import { SnackbarContent, CustomContentProps, closeSnackbar } from "notistack";
import React, { ReactNode, useCallback } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
    CardActions,
    CardContent,
    CardHeader,
    IconButton,
} from "@mui/material";
import Card from "@mui/material/Card";
import Button from "../Button";

interface ApiErrorProps extends CustomContentProps {
    id: string;
    showDismissButton: boolean;
    action: ReactNode;
    title: string;
    message: string;
    errors: { title: string; message: string }[];
}

// todo: this is an example and will need design input
const ApiError = React.forwardRef<HTMLDivElement, ApiErrorProps>(
    ({ id, message, title, errors, action, showDismissButton = true }, ref) => {
        const handleDismiss = useCallback(() => {
            closeSnackbar(id);
        }, [id]);

        return (
            <SnackbarContent ref={ref} role="alert">
                <Card
                    style={{
                        backgroundColor: "#d32f2f",
                        color: "white",
                        fontSize: "14px",
                    }}>
                    <CardHeader
                        action={
                            <IconButton size="small" onClick={handleDismiss}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        }
                        title={title}
                        subheader={message}
                        subheaderTypographyProps={{
                            color: "white",
                            fontSize: "14px",
                        }}
                        titleTypographyProps={{ fontSize: "18px" }}
                    />
                    {errors?.length && (
                        <CardContent>
                            <ul style={{ padding: "0 15px", marginTop: 0 }}>
                                {errors.map(err => (
                                    <li>{err.message}</li>
                                ))}
                            </ul>
                        </CardContent>
                    )}
                    <CardActions style={{ justifyContent: "end", gap: "10px" }}>
                        {showDismissButton && (
                            <Button
                                color="error"
                                size="small"
                                onClick={handleDismiss}>
                                Dismiss
                            </Button>
                        )}
                        {action}
                    </CardActions>
                </Card>
            </SnackbarContent>
        );
    }
);

export default ApiError;
