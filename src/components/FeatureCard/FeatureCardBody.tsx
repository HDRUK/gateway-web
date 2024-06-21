import { Box, TypographyProps } from "@mui/material";

export default function FeatureCardBody({
    children,
    ...restProps
}: TypographyProps) {
    return <Box {...restProps}>{children}</Box>;
}
