"use client";

import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

export interface DarEnquiryDialogProps {
    onGeneralEnquiryClick(): void;
    onFeasibilityEnquiryClick(): void;
    isDAREnabled: boolean;
}

const TRANSLATION_PATH = "modules.dialogs.DarEnquiryDialog";

const DarEnquiryDialog = ({
    onGeneralEnquiryClick,
    onFeasibilityEnquiryClick,
    isDAREnabled,
}: DarEnquiryDialogProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { hideDialog } = useDialog() as GlobalDialogContextProps;

    const handleGeneralEnquiry = () => {
        hideDialog();

        onGeneralEnquiryClick();
    };

    const handleFeasibilityEnquiry = () => {
        hideDialog();

        onFeasibilityEnquiryClick();
    };

    return (
        <Dialog title={isDAREnabled ? t("titleEnabled") : t("titleNotEnabled")}>
            <MuiDialogContent>
                <Typography mb={2}>
                    {isDAREnabled
                        ? t("messageEnabled")
                        : t("messageNotEnabled")}
                </Typography>
                <Typography>
                    {isDAREnabled
                        ? t("messageEnabledOtherInstructions")
                        : t("messageNotEnabledOtherInstructions")}
                </Typography>
            </MuiDialogContent>
            <MuiDialogActions>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleGeneralEnquiry}>
                    {t("generalEnquiryButton")}
                </Button>
                <Button onClick={handleFeasibilityEnquiry}>
                    {t("feasibilityEnquiryButton")}
                </Button>
            </MuiDialogActions>
        </Dialog>
    );
};

export default DarEnquiryDialog;
