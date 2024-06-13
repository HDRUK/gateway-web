import Box from "@/components/Box";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Typography from "@/components/Typography";
import theme from "@/config/theme";

interface GradientBoxesProps {
    maxWidth?: number;
    items: { title: string; text: string }[];
}

const GradientBoxes = ({ items, maxWidth }: GradientBoxesProps) => {
    return (
        <Box
            sx={{
                display: { tablet: "flex" },
                justifyContent: "center",
            }}
            gap={2}>
            {items.map(item => (
                <Box
                    key={item.title}
                    sx={{
                        maxWidth: { tablet: maxWidth },
                        flex: 1,
                        mb: { mobile: 2, tablet: 0 },
                        p: 3,
                        textAlign: "center",
                        background: `linear-gradient(97.46deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    }}>
                    <Typography
                        fontSize={{ mobile: 20, desktop: 28 }}
                        m={0}
                        variant="h2"
                        component="div"
                        color="white">
                        <EllipsisLineLimit maxLine={1} text={item.title} />
                    </Typography>
                    <Typography
                        sx={{ display: { mobile: "none", desktop: "block" } }}
                        fontSize={16}
                        m={0}
                        color="white"
                        component="div">
                        <EllipsisLineLimit maxLine={4} text={item.text} />
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default GradientBoxes;
