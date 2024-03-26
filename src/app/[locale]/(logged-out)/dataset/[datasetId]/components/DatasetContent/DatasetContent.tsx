import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Paper from "@/components/Paper";

const TRANSLATION_PATH = "pages.dataset";

const DatasetContent = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    tablet: "repeat(5, 1fr)",
                },
                gap: {
                    mobile: 1,
                    tablet: 2,
                },
                p: 0,
            }}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 5", laptop: "span 3" },
                    p: 0,
                }}>
                <Paper sx={{ borderRadius: 2, p: 2 }}>
                    {t("datasetDetails")}
                </Paper>
            </Box>
            <Box
                sx={{
                    gridColumn: { tablet: "span 5", laptop: "span 2" },
                    p: 0,
                }}>
                <Paper sx={{ borderRadius: 2, p: 2 }}>
                    {t("datasetPublications")}
                </Paper>
            </Box>
        </BoxContainer>
    );
};

export default DatasetContent;
