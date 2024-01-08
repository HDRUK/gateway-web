"use client";

import { Typography } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Box from "@/components/Box";
import Dialog from "@/components/Dialog";
import ModalButtons from "@/components/ModalButtons";
import useDialog from "@/hooks/useDialog";

const TRANSLATION_PATH = "modules.dialogs.CohortRequestSentDialog";

const CohortRequestSentDialog = () => {
    const { push } = useRouter();
    const { hideDialog } = useDialog();

    const t = useTranslations(TRANSLATION_PATH);

    const handleSuccess = () => {
        hideDialog();
        push("/");
    };

    return (
        <Dialog title={t("title")}>
            <Box sx={{ p: 0 }} component="form">
                <MuiDialogContent>
                    <Typography sx={{ mb: 2 }}>{t("text")}</Typography>
                </MuiDialogContent>
                <MuiDialogActions>
                    <ModalButtons
                        confirmText={t("confirmButton")}
                        onSuccess={handleSuccess}
                    />
                </MuiDialogActions>
            </Box>
        </Dialog>
    );
};

export default CohortRequestSentDialog;
