import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { SearchResultTool } from "@/interfaces/Search";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import HTMLContent from "@/components/HTMLContent";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import { CategoryHeader } from "./ToolDetailsDialog.styles";

interface ToolDetailsDialogProps {
    result: SearchResultTool;
}

const TRANSLATION_PATH = "modules.dialogs.ToolDetailsDialog";

const ToolDetailsDialog = ({ result }: ToolDetailsDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const { name: title, description } = result;

    return (
        <Dialog title={title}>
            <MuiDialogContent>
                <CategoryHeader variant="h3">{t("description")}</CategoryHeader>
                <Box
                    sx={{ display: "flex", flexWrap: "wrap", p: 0, mb: 2 }}
                    gap={1}>
                    <MarkDownSanitizedWithHtml content={description} />
                </Box>

                <CategoryHeader variant="h3">{t("keywords")}</CategoryHeader>

                <CategoryHeader variant="h3">{t("team")}</CategoryHeader>
            </MuiDialogContent>
        </Dialog>
    );
};

export default ToolDetailsDialog;
