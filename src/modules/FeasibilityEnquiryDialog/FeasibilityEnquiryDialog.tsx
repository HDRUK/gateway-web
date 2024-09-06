import { Button, Divider, Grid } from "@mui/material";
import MuiDialogContent from "@mui/material/DialogContent";
import Markdown from "markdown-to-jsx";
import { useTranslations } from "next-intl";
import { KeyedMutator } from "swr";
import { DatasetEnquiry } from "@/interfaces/Enquiry";
import { Library, NewLibrary } from "@/interfaces/Library";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import useSidebar from "@/hooks/useSidebar";
import apis from "@/config/apis";
import FeasibilityEnquirySidebar from "@/app/[locale]/(logged-out)/search/components/FeasibilityEnquirySidebar";

const TRANSLATION_PATH = "modules.dialogs.FeasibilityEnquiryDialog";

interface DatasetQuickViewDialogProps {
    result: DatasetEnquiry;
    mutateLibraries: KeyedMutator<Library[]>;
}

const FeasibilityEnquiryDialog = ({
    result,
    mutateLibraries,
}: DatasetQuickViewDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog();
    const { showSidebar } = useSidebar();
    const { user } = useAuth();

    const handleFeasibilityEnquiries = () => {
        showSidebar({
            title: "Messages",
            content: <FeasibilityEnquirySidebar datasets={[result]} />,
        });
    };

    const addLibrary = usePost<NewLibrary>(apis.librariesV1Url, {
        itemName: `Library item`,
    });

    const handleAddToLibrary = () => {
        const payload: NewLibrary = {
            user_id: user?.id,
            dataset_id: Number(result.datasetId),
        };

        addLibrary(payload).then(() => {
            mutateLibraries();
            hideDialog();
        });
    };

    return (
        <Dialog onClose={() => hideDialog()}>
            <MuiDialogContent sx={{ paddingX: 2 }}>
                <Grid
                    container
                    rowSpacing={4}
                    columnSpacing={1}
                    alignItems="center">
                    <Grid item tablet={5} mobile={5} desktop={5} sx={{ p: 0 }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center">
                            <Button
                                variant="contained"
                                onClick={handleFeasibilityEnquiries}>
                                {t("enquire")}
                            </Button>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Divider
                            sx={{ mr: 2, height: 200 }}
                            orientation="vertical"
                            color="black"
                        />
                    </Grid>
                    <Grid item tablet={6} mobile={6} desktop={6} sx={{ p: 0 }}>
                        <Typography mb={2}>
                            <Markdown>{t("helpText")}</Markdown>
                        </Typography>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleAddToLibrary}>
                            {t("addToLibrary")}
                        </Button>
                    </Grid>
                </Grid>
            </MuiDialogContent>
        </Dialog>
    );
};

export default FeasibilityEnquiryDialog;
