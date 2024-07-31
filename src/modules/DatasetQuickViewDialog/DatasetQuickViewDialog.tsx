import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { SearchResultDataset } from "@/interfaces/Search";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import { CategoryHeader } from "./DatasetQuickViewDialog.styles";

const TRANSLATION_PATH = "modules.dialogs.DatasetQuickView";
const TITLE_CHARACTER_LIMIT = 120;
const CHARACTER_LIMIT = 50;

interface DatasetQuickViewDialogProps {
    result: SearchResultDataset;
}

const DatasetQuickViewDialog = ({ result }: DatasetQuickViewDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog();

    const { keywords, datasetType, datasetSubType } =
        result?.metadata?.summary || {};

    /* note: sort this out as this is returning the GWDM, rather than the schema */
    const { collectionSituation } = result?.metadata?.provenance.origin || {};
    /* note: quite hacky to split */
    const formattedCollectionSource = collectionSituation
        ?.split(";,;")
        .join(", ");

    return (
        <Dialog
            titleSx={{ paddingLeft: 8 }}
            title={result?.metadata?.summary.shortTitle}
            titleLimit={TITLE_CHARACTER_LIMIT}
            onClose={() => hideDialog()}>
            <MuiDialogContent sx={{ paddingX: 8 }}>
                <Typography variant="h3" mb={2}>
                    {t("keyWords")}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", p: 0 }} gap={1}>
                    {keywords.split(";,;").map(word => (
                        <EllipsisCharacterLimit
                            key={word}
                            text={word}
                            isButton
                            characterLimit={CHARACTER_LIMIT}
                        />
                    ))}
                </Box>

                <CategoryHeader variant="h3">{t("dataType")}</CategoryHeader>
                <Typography>
                    {datasetType} {datasetSubType && `, ${datasetSubType}`}
                </Typography>

                <CategoryHeader variant="h3">
                    {t("collectionSource")}
                </CategoryHeader>
                {formattedCollectionSource ? (
                    <Typography>{formattedCollectionSource}</Typography>
                ) : (
                    <Typography> {t("noCollectionSource")} </Typography>
                )}
            </MuiDialogContent>
        </Dialog>
    );
};

export default DatasetQuickViewDialog;
