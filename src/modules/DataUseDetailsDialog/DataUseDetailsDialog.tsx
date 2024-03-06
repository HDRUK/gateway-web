import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { SearchResultDataUse } from "@/interfaces/Search";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import { CategoryHeader } from "./DataUseDetailsDialog.styles";

interface DataUseDetailsDialogProps {
    result: SearchResultDataUse;
}

const TRANSLATION_PATH = "modules.dialogs.DataUseDetailsDialog";

const DataUseDetailsDialog = ({ result }: DataUseDetailsDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Dialog title={result.projectTitle}>
            <MuiDialogContent>
                <Typography variant="h3" mb={2}>
                    {t("datasets")}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", p: 0 }} gap={1}>
                    {result.datasetTitles.map(dataset => (
                        <Button size="small">{dataset}</Button>
                    ))}
                </Box>

                <CategoryHeader variant="h3">
                    {t("leadApplicantOrganisation")}
                </CategoryHeader>
                <Typography>{result.organisationName}</Typography>

                <CategoryHeader variant="h3">
                    {t("dataCustodian")}
                </CategoryHeader>
                <Typography>
                    {`${result.team?.member_of} > ${result.team.name}`}
                </Typography>
            </MuiDialogContent>
        </Dialog>
    );
};

export default DataUseDetailsDialog;
