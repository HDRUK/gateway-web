"use client";

import { Button } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Dialog from "@/components/Dialog";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

export interface DarEnquiryDialogProps {
    onGeneralEnquiryClick(): void;
    onFeasibilityEnquiryClick(): void;
    isDarEnabled: boolean;
    isDar: boolean;
    url: string;
    modalHeader: string | null;
    modalContent: string | null;
}

const TRANSLATION_PATH = "modules.dialogs.DarEnquiryDialog";

const DarEnquiryDialog = ({
    onGeneralEnquiryClick,
    onFeasibilityEnquiryClick,
    isDarEnabled,
    modalHeader,
    modalContent,
    isDar,
    url,
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

    const dialogTitle =
        modalHeader ||
        (isDarEnabled ? t("titleEnabled") : t("titleNotEnabled"));
    const dialogContent =
        modalContent ||
        (isDarEnabled ? t("messageEnabled") : t("messageNotEnabled"));

    const isDarAndIsEnabled: boolean = isDarEnabled && isDar;

    return (
        <Dialog title={dialogTitle}>
            <MuiDialogContent>
                <Typography mb={2}>{dialogContent}</Typography>
                {!isDarEnabled && (
                    <Typography>
                        {t.rich("messageNotEnabledOtherInstructions", {
                            // eslint-disable-next-line react/no-unstable-nested-components
                            generalEnquiryLink: () => (
                                <Button
                                    variant="link"
                                    onClick={handleGeneralEnquiry}>
                                    {t("generalEnquiryLink")}
                                </Button>
                            ),
                            // eslint-disable-next-line react/no-unstable-nested-components
                            feasabilityEnquiryLink: () => (
                                <Button
                                    variant="link"
                                    onClick={handleFeasibilityEnquiry}>
                                    {t("feasibilityEnquiryLink")}
                                </Button>
                            ),
                        })}
                    </Typography>
                )}
            </MuiDialogContent>
            <MuiDialogActions>
                {isDarAndIsEnabled && (
                    <>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleGeneralEnquiry}>
                            {t("generalEnquiryButton")}
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleFeasibilityEnquiry}>
                            {t("feasibilityEnquiryButton")}
                        </Button>
                    </>
                )}
                {!isDarEnabled && isDar && (
                    <Button variant="contained" href={`${url}#anchor6`}>
                        {t("accessInformationButton")}
                    </Button>
                )}
            </MuiDialogActions>
        </Dialog>
    );
};

export default DarEnquiryDialog;
