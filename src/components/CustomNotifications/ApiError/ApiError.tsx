import React, { ReactNode, useCallback } from "react";
import { Button } from "@hdruk/ui";
import { tokens } from "@hdruk/ui/theme";
import { CardActions, CardContent, CardHeader } from "@mui/material";
import Card from "@mui/material/Card";
import { SnackbarContent, CustomContentProps, closeSnackbar } from "notistack";

interface ApiErrorProps extends CustomContentProps {
    id: string;
    showDismissButton?: boolean;
    action: ReactNode;
    title: string;
    message: string;
    errors?: { message: string }[];
}

const ApiError = React.forwardRef<HTMLDivElement, ApiErrorProps>(
    ({ id, message, title, errors, action, showDismissButton = true }, ref) => {
        const handleDismiss = useCallback(() => {
            closeSnackbar(id);
        }, [id]);

        return (
            <SnackbarContent ref={ref} role="alert">
                <Card
                    style={{
                        backgroundColor: tokens.background.error,
                        borderColor: tokens.status.error,
                        borderStyle: "solid",
                        color: tokens.text.error,
                        fontSize: "14px",
                    }}>
                    <CardHeader
                        title={title}
                        subheader={message}
                        subheaderTypographyProps={{
                            color: tokens.text.error,
                            fontSize: "14px",
                        }}
                        titleTypographyProps={{ fontSize: "18px" }}
                    />
                    {errors?.length && (
                        <CardContent>
                            <ul style={{ padding: "0 15px", marginTop: 0 }}>
                                {errors.map(err => (
                                    <li key={err.message}>{err.message}</li>
                                ))}
                            </ul>
                        </CardContent>
                    )}
                    <CardActions style={{ justifyContent: "end", gap: "10px" }}>
                        {showDismissButton && (
                            <Button
                                purpose="tertiary"
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
