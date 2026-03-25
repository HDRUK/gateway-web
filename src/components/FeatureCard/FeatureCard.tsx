import { ReactNode } from "react";
import { Box, Card, CardProps, useTheme } from "@mui/material";
import Link from "../Link";

export interface FeatureCardProps extends CardProps {
    icon: ReactNode;
    href: string;
}

export default function FeatureCard({
    sx,
    icon,
    children,
    href,
    ...restProps
}: FeatureCardProps) {
    const theme = useTheme();

    return (
        <Card
            sx={{
                textAlign: "center",
                textDecoration: "none",
                ...sx,
            }}
            component={Link}
            href={href}
            {...restProps}>
            <Box
                sx={{
                    height: "4rem",
                    color: "primary.main",
                    "> *": { fontSize: theme.typography.h3 },
                }}>
                {icon}
            </Box>
            {children}
        </Card>
    );
}
