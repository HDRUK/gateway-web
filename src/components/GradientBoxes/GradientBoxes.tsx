import Box from "@/components/Box";
import EllipsisLineLimit from "@/components/EllipsisLineLimit";
import Link from "@/components/Link";
import Typography from "@/components/Typography";
import theme from "@/config/theme";
import { ArrowForward, OpenInNewIcon } from "@/consts/icons";

interface GradientBoxesProps {
    maxWidth?: number;
    items: {
        title: string;
        text: string;
        href: string;
        externalUrl: boolean;
    }[];
}

const GradientBoxes = ({ items, maxWidth }: GradientBoxesProps) => {
    return (
        <Box
            sx={{
                display: { tablet: "flex" },
                justifyContent: "center",
                p: 0,
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
                        background: `linear-gradient(97.46deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                    }}>
                    <Link
                        href={item.href}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            textDecoration: "none",
                            color: "white",
                        }}
                        target={item.externalUrl ? "_blank" : "_self"}>
                        <Typography
                            fontSize={{ mobile: 20, desktop: 28 }}
                            m={0}
                            mr={1}
                            variant="h2"
                            component="div">
                            {item.title}
                        </Typography>
                        {item.externalUrl ? (
                            <OpenInNewIcon />
                        ) : (
                            <ArrowForward />
                        )}
                    </Link>

                    <Typography
                        fontSize={16}
                        mt={1}
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
