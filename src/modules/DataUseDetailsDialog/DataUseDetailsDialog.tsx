import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { SearchResultDataUse } from "@/interfaces/Search";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Typography from "@/components/Typography";
import { CategoryHeader } from "./DataUseDetailsDialog.styles";

interface DataUseDetailsDialogProps {
    result: SearchResultDataUse;
}

const TRANSLATION_PATH = "modules.dialogs.DataUseDetailsDialog";
const TITLE_CHARACTER_LIMIT = 120;
const CHARACTER_LIMIT = 50;

const DataUseDetailsDialog = ({ result }: DataUseDetailsDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const leadOrgNames = result?.organisationName?.split(",");

    return (
        <Dialog title={result.projectTitle} titleLimit={TITLE_CHARACTER_LIMIT}>
            <MuiDialogContent>
                <Typography variant="h3" mb={2}>
                    {t("datasets")}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", p: 0 }} gap={1}>
                    {result.datasetTitles.map(dataset => (
                        <EllipsisCharacterLimit
                            text={dataset}
                            isButton
                            characterLimit={CHARACTER_LIMIT}
                        />
                    ))}
                </Box>

                <CategoryHeader variant="h3">
                    {t("leadApplicantOrganisation")}
                </CategoryHeader>
                {leadOrgNames.map(name => (
                    <Typography>{name}</Typography>
                ))}

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
