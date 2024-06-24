import { Typography, TypographyProps } from "@mui/material";

export default function FeatureCardHeading({
    variant = "h3",
    color = "primary",
    children,
    ...restProps
}: TypographyProps) {
    return (
        <Typography variant={variant} color={color} {...restProps}>
            {children}
        </Typography>
    );
}
