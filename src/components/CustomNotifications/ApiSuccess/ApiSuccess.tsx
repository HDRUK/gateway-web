import { SnackbarContent, CustomContentProps, closeSnackbar } from "notistack";
import React, { ReactNode, useCallback } from "react";
import {
    CardActions,
    CardContent,
    CardHeader,
} from "@mui/material";
import Card from "@mui/material/Card";
import Button from "../../Button";

interface ApiSuccessProps extends CustomContentProps {
    id: string;
    showDismissButton: boolean;
    action: ReactNode;
    title: string;
    message: string;
}

const ApiSuccess = React.forwardRef<HTMLDivElement, ApiSuccessProps>(
    ({ id, message, action, showDismissButton = true }, ref) => {
        const handleDismiss = useCallback(() => {
            closeSnackbar(id);
        }, [id]);

        return (
            <SnackbarContent ref={ref} role="alert">
                <Card
                    style={{
                        backgroundColor: "#E2F3F0",
                        borderColor: "#2C8267",
                        borderStyle: "solid",
                        color: "#2C8267",
                        fontSize: "14px",
                    }}>
                    <CardHeader
                        title="Success"
                        subheaderTypographyProps={{
                            color: "#2C8267",
                            fontSize: "14px",
                        }}
                        titleTypographyProps={{ fontSize: "18px" }}
                    />
                    <CardContent>
                        { message }
                    </CardContent>
                    <CardActions style={{ justifyContent: "end", gap: "10px" }}>
                        {showDismissButton && (
                            <Button
                                color="success"
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

export default ApiSuccess;
