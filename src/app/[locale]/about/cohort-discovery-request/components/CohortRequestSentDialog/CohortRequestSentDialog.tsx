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
import {
    COHORT_DISCOVERY_REQUEST_SENT_DIALOG,
    CONFIRM_BUTTON,
    DIALOGS,
    MODULES,
    TEXT,
    TITLE,
} from "@/consts/translation";

const CohortRequestSentDialog = () => {
    const { push } = useRouter();
    const { hideDialog } = useDialog();

    const t = useTranslations(
        `${MODULES}.${DIALOGS}.${COHORT_DISCOVERY_REQUEST_SENT_DIALOG}`
    );

    const handleSuccess = () => {
        hideDialog();
        push("/");
    };

    return (
        <Dialog title={t(TITLE)}>
            <Box sx={{ p: 0 }} component="form">
                <MuiDialogContent>
                    <Typography sx={{ mb: 2 }}>{t(TEXT)}</Typography>
                </MuiDialogContent>
                <MuiDialogActions>
                    <ModalButtons
                        confirmText={t(CONFIRM_BUTTON)}
                        onSuccess={handleSuccess}
                    />
                </MuiDialogActions>
            </Box>
        </Dialog>
    );
};

export default CohortRequestSentDialog;
