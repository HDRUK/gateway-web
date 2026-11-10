import { Typography, TypographyProps } from "@mui/material";

export default function FeatureCardHeading({
    variant = "h6",
    component = "h3",
    color = "primary",
    sx,
    children,
    ...restProps
}: TypographyProps) {
    return (
        <Typography
            variant={variant}
            component={component}
            color={color}
            sx={{ mb: 1, ...sx }}
            {...restProps}>
            {children}
        </Typography>
    );
}
