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
    url: string;
}

const TRANSLATION_PATH = "modules.dialogs.DarEnquiryDialog";

const DarEnquiryDialog = ({
    onGeneralEnquiryClick,
    onFeasibilityEnquiryClick,
    isDarEnabled,
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

    return (
        <Dialog title={isDarEnabled ? t("titleEnabled") : t("titleNotEnabled")}>
            <MuiDialogContent>
                <Typography mb={2}>
                    {isDarEnabled
                        ? t("messageEnabled")
                        : t("messageNotEnabled")}
                </Typography>
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
                {isDarEnabled ? (
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
                ) : (
                    <Button variant="contained" href={`${url}#anchor6`}>
                        {t("accessInformationButton")}
                    </Button>
                )}
            </MuiDialogActions>
        </Dialog>
    );
};

export default DarEnquiryDialog;
