import { TypographyProps } from "@mui/material";
import Image from "next/image";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import FeaturedMetric from "../FeaturedMetric";
import TitleWithBg from "../TitleWithBg";

interface TitlePanelProps extends TypographyProps {
    image: string;
    text: string;
    title: string;
    id?: string;
}

const TitlePanel = ({ image, text, title, id }: TitlePanelProps) => {
    return (
        <Box sx={{ p: 0, display: "flex" }}>
            <Box
                sx={{
                    p: 0,
                    mr: { sm: 2 },
                    mt: { sm: 6 },
                    flex: 1,
                    flexDirection: { xs: "row", sm: "column" },
                    width: "100%",
                    minHeight: {
                        lg: 360,
                    },
                }}>
                <TitleWithBg mb={2} title={title} />
                <Box
                    sx={{
                        minHeight: {
                            sm: 190,
                            lg: 180,
                        },
                        p: 0,
                    }}>
                    <Typography
                        color="white"
                        fontSize={{ xs: 14, sm: 18, lg: 24 }}>
                        {text}
                    </Typography>
                </Box>
                <FeaturedMetric selectedButton={id} />
            </Box>
            <Box
                sx={{
                    p: 0,
                    position: "relative",
                    display: { xs: "none", sm: "block" },
                }}>
                <Image
                    width={554}
                    height={374}
                    alt={title}
                    src={image}
                    priority
                    style={{ objectFit: "scale-down", maxWidth: "100%" }}
                />
            </Box>
        </Box>
    );
};

export default TitlePanel;
