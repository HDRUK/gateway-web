import { Button, Divider, Grid } from "@mui/material";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { SearchResultDataset } from "@/interfaces/Search";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import EllipsisCharacterLimit from "@/components/EllipsisCharacterLimit";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";

// import { CategoryHeader } from "./DatasetQuickViewDialog.styles";

const TRANSLATION_PATH = "modules.dialogs.FeasibilityEnquiryDialog";

interface DatasetQuickViewDialogProps {
    result: SearchResultDataset;
}

const FeasibilityEnquiryDialog = ({ result }: DatasetQuickViewDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog();

    return (
        <Dialog
            // titleSx={{ paddingLeft: 8 }}
            // title={"Title"}
            onClose={() => hideDialog()}>
            <MuiDialogContent sx={{ paddingX: 8 }}>
                <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                    }}>
                    <Button sx={{display: 'flex'}} variant="contained">{t("enquire")}</Button>
                    {/* <Divider
                        orientation="vertical"
                        variant="middle"
                        color="black"
                    /> */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
                        <Typography variant="h3" mb={2}>
                            {
                                "BLAH BLAH6To make a feasibility enquiry for multiple datasets:\n1. Add datasets to your library2. Generate a feasibility enquiry from your library page"
                            }
                        </Typography>
                        <Button variant="outlined" color="secondary">
                            {t("addToLibrary")}
                        </Button>
                    </Box>
                </Box>
            </MuiDialogContent>
        </Dialog>
    );
};

export default FeasibilityEnquiryDialog;
