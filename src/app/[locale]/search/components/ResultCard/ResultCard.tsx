import { Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchResult } from "@/interfaces/Search";
import Typography from "@/components/Typography";
import { getDateRange } from "@/utils/search";

interface ResultCardProps {
    result: SearchResult;
}

const TRANSLATION_PATH = "pages.search.components.ResultCard";

const ResultCard = ({ result }: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const {
        metadata: { metadata },
    } = result;

    return (
        <>
            <ListItem sx={{ p: 0 }} alignItems="flex-start">
                <ListItemButton component="a" href="">
                    <ListItemText
                        primary={metadata.summary.shortTitle}
                        primaryTypographyProps={{
                            color: "primary",
                            fontWeight: 600,
                            fontSize: 16,
                            mb: 1.5,
                        }}
                        secondary={
                            <>
                                <Typography
                                    sx={{
                                        textDecoration: "uppercase",
                                        fontWeight: 400,
                                        fontSize: 16,
                                        color: "black",
                                        mb: 1.5,
                                    }}>
                                    {metadata.summary.publisher.publisherName}
                                </Typography>
                                <Typography
                                    sx={{ mb: 1.5 }}
                                    component="div"
                                    variant="body2"
                                    color="text.gray">
                                    {metadata.summary.abstract}
                                </Typography>
                                <Typography
                                    color="secondary"
                                    sx={{ fontSize: 16 }}>
                                    {t("dateLabel")}: {getDateRange(metadata)}
                                </Typography>
                            </>
                        }
                    />
                </ListItemButton>
            </ListItem>
            <Divider component="li" />
        </>
    );
};

export default ResultCard;
