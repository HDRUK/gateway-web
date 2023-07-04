import { SnackbarContent, CustomContentProps, closeSnackbar } from "notistack";
import React, { ReactNode, useCallback } from "react";
import {
    CardActions,
    CardContent,
    CardHeader,
} from "@mui/material";
import Card from "@mui/material/Card";
import Button from "../../Button";

interface ApiInfoProps extends CustomContentProps {
    id: string;
    showDismissButton: boolean;
    action: ReactNode;
    title: string;
    message: string;
}

const ApiInfo = React.forwardRef<HTMLDivElement, ApiInfoProps>(
    ({ id, message, action, showDismissButton = true }, ref) => {
        const handleDismiss = useCallback(() => {
            closeSnackbar(id);
        }, [id]);

        return (
            <SnackbarContent ref={ref} role="alert">
                <Card
                    style={{
                        backgroundColor: "#E3F4FB",
                        borderColor: "#4E95C8",
                        borderStyle: "solid",
                        color: "#4E95C8",
                        fontSize: "14px",
                    }}>
                    <CardHeader
                        title="Warning"
                        subheaderTypographyProps={{
                            color: "#4E95C8",
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

export default ApiInfo;
