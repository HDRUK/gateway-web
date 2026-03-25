import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import RequestNhseSdeAccessButton from "@/components/RequestNhseSdeAccessButton";
import Typography from "@/components/Typography";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import useDialog from "@/hooks/useDialog";
import theme from "@/config/theme";
import { useFeatures } from "@/providers/FeatureProvider";

const TRANSLATION_PATH = "modules.CohortTermsSuccessDialog";

const CohortTermsSuccessDialog = ({ onClose }: { onClose: () => void }) => {
    const { user } = useAuth();
    const t = useTranslations(TRANSLATION_PATH);
    const { isNhsSdeApplicationsEnabled } = useFeatures();
    const { nhseSdeRequestStatus, isLoading } = useCohortStatus(user?.id);

    const { hideDialog } = useDialog();

    const handleCloseDialog = () => {
        onClose && onClose();
        hideDialog();
    };

    const showNhsInfo = isNhsSdeApplicationsEnabled && !nhseSdeRequestStatus;

    if (isLoading) {
        return;
    }

    return (
        <Dialog
            onClose={() => handleCloseDialog()}
            title=""
            maxWidth={"tablet"}
            fullWidth={false}
            showCloseButton>
            <MuiDialogContent
                sx={{
                    paddingX: 3,
                    textAlign: "center",
                }}>
                <Box sx={{ my: 2 }}>
                    <Typography variant="h2" color="secondary">
                        {t("title")}
                    </Typography>
                    <Typography>{t("reviewTime")}</Typography>
                </Box>

                {showNhsInfo && (
                    <Box sx={{ mt: 1, p: 0 }}>
                        <Typography
                            variant="h2"
                            color={theme.palette.primary.main}>
                            {t("nhsTitle")}
                        </Typography>
                        <Typography>{t("nhsInfo1")}</Typography>
                        <Typography>{t("nhsInfo2")}</Typography>
                    </Box>
                )}
            </MuiDialogContent>

            {showNhsInfo && (
                <MuiDialogActions
                    sx={{
                        justifyContent: "center",
                        mt: 0,
                        p: 0,
                    }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: 2,
                        }}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                handleCloseDialog();
                            }}>
                            {t("maybeLater")}
                        </Button>

                        <RequestNhseSdeAccessButton
                            label={t("nhsButtonLabel")}
                            action={() => handleCloseDialog()}
                        />
                    </Box>
                </MuiDialogActions>
            )}
        </Dialog>
    );
};

export default CohortTermsSuccessDialog;
