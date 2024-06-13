import Box from "@/components/Box";
import Typography from "@/components/Typography";
import theme from "@/config/theme";

interface GradientBannerProps {
    title: string;
}

const GradientBanner = ({ title }: GradientBannerProps) => {
    return (
        <Box
            sx={{
                p: 3,
                textAlign: "center",
                background: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
            }}>
            <Typography fontSize={28} m={0} variant="h2" color="white">
                {title}
            </Typography>
        </Box>
    );
};

export default GradientBanner;
