"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { AllowedErrors, errors } from "@/config/errors";
import { RemoveCircleIcon } from "@/consts/icons";

interface ErrorDisplayProps {
    variant: AllowedErrors;
}

const ErrorDisplay = ({ variant }: ErrorDisplayProps) => {
    const theme = useTheme();
    const errorStatusCode = variant;

    const { message, imageSrc, imageAlt, icon } = errors[errorStatusCode];

    const Icon = icon || RemoveCircleIcon;

    return (
        <Box
            sx={{
                textAlign: "center",
                p: 2,
                display: "flex",
                maxHeight: "550px",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                [theme.breakpoints.down("laptop")]: {
                    my: "auto",
                },
            }}>
            <Box sx={{ maxWidth: "550px" }}>
                {imageSrc ? (
                    <Box
                        component="img"
                        width="100%"
                        src={imageSrc}
                        alt={imageAlt}
                    />
                ) : (
                    <Icon color="error" sx={{ fontSize: "200px" }} />
                )}
                <Typography variant="h2" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            </Box>
        </Box>
    );
};

export default ErrorDisplay;
