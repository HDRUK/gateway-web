import { tokens } from "@hdruk/ui/theme";
import { TypographyProps } from "@mui/material";
import Image from "next/image";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import FeaturedMetric from "../FeaturedMetric";
import TitleWithBg from "../TitleWithBg";

interface TitlePanelContent {
    title: string;
    text: string;
}

interface TitlePanelProps extends TypographyProps {
    image: string;
    text: string;
    title: string;
    id?: string;
    reservedContent?: TitlePanelContent[];
}

const TitlePanel = ({
    image,
    text,
    title,
    id,
    reservedContent = [],
}: TitlePanelProps) => {
    const renderContent = (content: TitlePanelContent, isReserved: boolean) => (
        <Box
            key={content.title}
            aria-hidden={isReserved || undefined}
            sx={{
                p: 0,
                gridArea: "1 / 1",
                ...(isReserved && {
                    visibility: "hidden",
                    "@media (hover: none)": { display: "none" },
                }),
            }}>
            <TitleWithBg
                variant="h3"
                component={isReserved ? "div" : "h1"}
                mb={2}
                title={content.title}
                bgcolor={tokens.brand.secondary}
            />
            <Box
                sx={{
                    minHeight: {
                        sm: 210,
                        lg: 200,
                    },
                    p: 0,
                }}>
                <Typography color="white" fontSize={{ xs: 14, sm: 18, lg: 24 }}>
                    {content.text}
                </Typography>
            </Box>
        </Box>
    );

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
                <Box sx={{ p: 0, display: "grid" }}>
                    {reservedContent.map(content =>
                        renderContent(content, true)
                    )}
                    {renderContent({ title, text }, false)}
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
