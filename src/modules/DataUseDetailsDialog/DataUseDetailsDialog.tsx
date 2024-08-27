import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { SearchResultDataUse } from "@/interfaces/Search";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import { RouteName } from "@/consts/routeName";
import { CategoryHeader } from "./DataUseDetailsDialog.styles";

interface DataUseDetailsDialogProps {
    result: SearchResultDataUse;
}

const TRANSLATION_PATH = "modules.dialogs.DataUseDetailsDialog";
const TITLE_CHARACTER_LIMIT = 120;
const CHARACTER_LIMIT = 50;

const DataUseDetailsDialog = ({ result }: DataUseDetailsDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { push } = useRouter();
    const { hideDialog } = useDialog();
    const leadOrgNames = result?.organisationName?.split(",");

    const formattedTitle =
        result.projectTitle.length > TITLE_CHARACTER_LIMIT
            ? `${result.projectTitle.slice(0, TITLE_CHARACTER_LIMIT)}...`
            : result.projectTitle;

    return (
        <Dialog title={formattedTitle}>
            <MuiDialogContent>
                <Typography variant="h3" mb={2}>
                    {t("datasets")}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", p: 0 }} gap={1}>
                    {result.datasetTitles.map((dataset, index) => (
                        <EllipsisCharacterLimit
                            text={dataset}
                            isButton
                            characterLimit={CHARACTER_LIMIT}
                            onClick={() => {
                                hideDialog();
                                push(
                                    `/${RouteName.DATASET_ITEM}/${result.datasetIds[index]}`
                                );
                            }}
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
