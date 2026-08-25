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
        md: { xs: 20, sm: 20, lg: 28 },
        lg: { xs: 24, sm: 28, lg: 40 },
    };

    return (
        <Box
            sx={{
                bgcolor,
                display: "inline-block",
                width: "100%",
                textAlign: "center",
            }}
            {...rest}>
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
