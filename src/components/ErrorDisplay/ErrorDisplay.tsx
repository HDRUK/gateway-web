"use client";

import { Box, Typography, useTheme } from "@mui/material";
import { AllowedErrors, errors } from "@/config/errors";

interface ErrorDisplayProps {
    variant: AllowedErrors;
}

export default function ErrorDisplay({ variant }: ErrorDisplayProps) {
    const theme = useTheme();

    const errorStatusCode = variant;

    const { message, imageSrc, imageAlt } = errors[errorStatusCode];

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
                <Box
                    component="img"
                    width="100%"
                    src={imageSrc}
                    alt={imageAlt}
                />
                <Typography variant="h2" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            </Box>
        </Box>
    );
}
