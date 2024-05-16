import { useCallback } from "react";
import { Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { get } from "lodash";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SearchResultDataset } from "@/interfaces/Search";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { RouteName } from "@/consts/routeName";
import { getDateRange, getPopulationSize } from "@/utils/search";
import { Highlight } from "./ResultCard.styles";
interface ResultCardProps {
    result: SearchResultDataset;
}

const TRANSLATION_PATH = "pages.search.components.ResultCard";

const ResultCard = ({ result }: ResultCardProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();
    const metadata = get(result, "metadata");
    const highlight = get(result, "highlight");
    const { _id: datasetId } = result;

    const handleClickItem = useCallback(() => {
        router.push(`/${RouteName.DATASET_ITEM}/${datasetId}`);
    }, [datasetId, router]);

    if (!metadata) return null;

    // If available, display the first of the highlights from the abstract, or failing that from the description. 
    // Fallback is the (un-highlighted) abstract.
    const text_to_display =
        highlight?.abstract !== undefined
            ? highlight.abstract[0]
            : highlight?.description !== undefined
            ? highlight.description[0]
            : metadata.summary.abstract;

    return (
        <>
            <ListItem sx={{ p: 0 }} alignItems="flex-start">
                <ListItemButton component="a" onClick={handleClickItem}>
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
                                    {metadata.summary.publisher.name !==
                                    undefined
                                        ? metadata.summary.publisher.name
                                        : metadata.summary.publisher
                                              .publisherName}
                                </Typography>
                                <Highlight
                                    sx={{ mb: 1.5 }}
                                    component="div"
                                    variant="body2"
                                    color="text.gray"
                                    dangerouslySetInnerHTML={{ __html: text_to_display}}>
                                </Highlight>
                                <Box
                                    sx={{
                                        p: 0,
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}>
                                    <Typography
                                        color="secondary"
                                        sx={{ fontSize: 16 }}>
                                        {t("populationSize")}:{" "}
                                        {getPopulationSize(
                                            metadata,
                                            t("populationSizeNotReported")
                                        )}
                                    </Typography>
                                    <Typography
                                        color="secondary"
                                        sx={{ fontSize: 16 }}>
                                        {t("dateLabel")}:{" "}
                                        {getDateRange(metadata)}
                                    </Typography>
                                    <Typography> </Typography>
                                </Box>
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
