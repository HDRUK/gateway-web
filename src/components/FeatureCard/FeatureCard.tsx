import { ReactNode } from "react";
import { Box, CardProps, useTheme } from "@mui/material";
import Card from "../Card";

export interface FeatureCarProps extends CardProps {
    icon: ReactNode;
}

export default function FeatureCard({
    sx,
    icon,
    children,
    ...restProps
}: FeatureCarProps) {
    const theme = useTheme();

    return (
        <Card sx={{ textAlign: "center", ...sx }} {...restProps}>
            <Box
                sx={{
                    color: "primary.main",
                    "> *": { fontSize: theme.typography.h3 },
                }}>
                {icon}
            </Box>
            {children}
        </Card>
    );
}
