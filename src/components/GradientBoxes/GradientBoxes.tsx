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
        <Box sx={{ display: "flex", justifyContent: "center" }} gap={2}>
            {items.map(item => {
                return (
                    <Box
                        key={item.title}
                        sx={{
                            maxWidth,
                            flex: 1,
                            p: 3,
                            textAlign: "center",
                            background: `linear-gradient(97.46deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                        }}>
                        {" "}
                        <Typography
                            fontSize={28}
                            m={0}
                            variant="h2"
                            color="white">
                            <EllipsisLineLimit maxLine={1} text={item.title} />
                        </Typography>
                        <Typography fontSize={16} m={0} color="white">
                            <EllipsisLineLimit maxLine={4} text={item.text} />
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );
};

export default GradientBoxes;
