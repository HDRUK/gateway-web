import { TypographyProps } from "@mui/material";
import Image from "next/image";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import TitleWithBg from "../TitleWithBg";

interface HomepageTitlePanelProps extends TypographyProps {
    image: string;
    text: string;
    title: string;
}

const HomepageTitlePanel = ({
    image,
    text,
    title,
}: HomepageTitlePanelProps) => {
    return (
        <Box sx={{ p: 0, display: "flex", alignItems: { desktop: "center" } }}>
            <Box
                sx={{
                    p: 0,
                    mr: 2,
                    flex: 1,
                    textAlign: { mobile: "center", tablet: "left" },
                    flexDirection: { mobile: "row", tablet: "column" },
                }}>
                <TitleWithBg mb={2} title={title} />
                <Typography
                    color="white"
                    fontSize={{ mobile: 14, desktop: 24 }}>
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
                    style={{ objectFit: "scale-down" }}
                />
            </Box>
        </Box>
    );
};

export default HomepageTitlePanel;
