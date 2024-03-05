import { TypographyProps } from "@mui/material";
import Box from "@/components//Box";
import Typography from "@/components/Typography";

interface TitleWithBgProps extends TypographyProps {
    title: string;
    bgcolor?: string;
}

const TitleWithBg = ({
    variant = "h1",
    title,
    color = "white",
    noWrap = true,
    fontWeight = 400,
    bgcolor = "secondary.main",
    ...rest
}: TitleWithBgProps) => {
    return (
        <Box sx={{ bgcolor, display: "inline-block" }} {...rest}>
            <Typography
                sx={{ fontSize: { mobile: 24, tablet: 28, desktop: 40 } }}
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
