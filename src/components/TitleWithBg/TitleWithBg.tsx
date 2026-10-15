import { TypographyProps } from "@mui/material";
import Box from "@/components//Box";
import Typography from "@/components/Typography";

interface TitleWithBgProps extends TypographyProps {
    title: string;
    bgcolor?: string;
}

const TitleWithBg = ({
    variant = "h1",
    component,
    title,
    color = "white",
    noWrap = true,
    fontWeight = 400,
    bgcolor = "secondary.main",
    ...rest
}: TitleWithBgProps) => {
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
                sx={{ mb: 0 }}
                color={color}
                variant={variant}
                component={component}
                noWrap={noWrap}
                fontWeight={fontWeight}>
                {title}
            </Typography>
        </Box>
    );
};

export default TitleWithBg;
