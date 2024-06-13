import { TypographyProps } from "@mui/material";
import Box from "@/components//Box";
import Typography from "@/components/Typography";

interface TitleWithBgProps extends TypographyProps {
    title: string;
    bgcolor?: string;
    size?: "md" | "lg";
}

const TitleWithBg = ({
    variant = "h1",
    size = "lg",
    title,
    color = "white",
    noWrap = true,
    fontWeight = 400,
    bgcolor = "secondary.main",
    ...rest
}: TitleWithBgProps) => {
    const fontSizes = {
        md: { mobile: 20, tablet: 20, desktop: 28 },
        lg: { mobile: 24, tablet: 28, desktop: 40 },
    };

    return (
        <Box sx={{ bgcolor, display: "inline-block" }} {...rest}>
            <Typography
                sx={{ fontSize: fontSizes[size], mb: 0 }}
                color={color}
                variant={variant}
                noWrap={noWrap}
                fontWeight={fontWeight}>
                {title}
            </Typography>
        </Box>
    );
};

export default TitleWithBg;
