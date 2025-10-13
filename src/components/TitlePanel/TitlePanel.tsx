import { TypographyProps } from "@mui/material";
import Image from "next/image";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import TitleWithBg from "../TitleWithBg";

interface TitlePanelProps extends TypographyProps {
    image: string;
    text: string;
    title: string;
}

const TitlePanel = ({ image, text, title }: TitlePanelProps) => {
    return (
        <Box sx={{ p: 0, display: "flex" }}>
            <Box
                sx={{
                    p: 0,
                    mr: { tablet: 2 },
                    mt: { tablet: 6 },
                    flex: 1,
                    flexDirection: { mobile: "row", tablet: "column" },
                    width: "100%",
                }}>
                <TitleWithBg mb={2} title={title} />
                <Typography
                    color="white"
                    fontSize={{ mobile: 14, tablet: 18, desktop: 24 }}>
                    {text}
                </Typography>
            </Box>
            <Box
                sx={{
                    p: 0,
                    position: "relative",
                    display: { mobile: "none", tablet: "block" },
                }}>
                <Image
                    width={554}
                    height={374}
                    alt={title}
                    src={image}
                    priority
                    style={{ objectFit: "scale-down" }}
                />
            </Box>
        </Box>
    );
};

export default TitlePanel;
