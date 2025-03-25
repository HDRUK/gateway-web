import React, { ReactNode, useCallback } from "react";
import { CardActions, CardContent, CardHeader } from "@mui/material";
import Card from "@mui/material/Card";
import { SnackbarContent, CustomContentProps, closeSnackbar } from "notistack";
import Button from "@/components/Button";

interface ApiWarningProps extends CustomContentProps {
    id: string;
    showDismissButton?: boolean;
    title: string;
    action: ReactNode;
    message: string;
}

const ApiWarning = React.forwardRef<HTMLDivElement, ApiWarningProps>(
    (
        { id, message, action, showDismissButton = true, title = "Warning" },
        ref
    ) => {
        const handleDismiss = useCallback(() => {
            closeSnackbar(id);
        }, [id]);

        return (
            <SnackbarContent ref={ref} role="alert">
                <Card
                    style={{
                        backgroundColor: "#FBF7C2",
                        borderColor: "#856505",
                        borderStyle: "solid",
                        color: "#856505",
                        fontSize: "14px",
                    }}>
                    {title && (
                        <CardHeader
                            title={title}
                            subheaderTypographyProps={{
                                color: "#856505",
                                fontSize: "14px",
                            }}
                            titleTypographyProps={{ fontSize: "18px" }}
                        />
                    )}
                    <CardContent>{message}</CardContent>
                    <CardActions style={{ justifyContent: "end", gap: "10px" }}>
                        {showDismissButton && (
                            <Button
                                color="warning"
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

export default ApiWarning;
