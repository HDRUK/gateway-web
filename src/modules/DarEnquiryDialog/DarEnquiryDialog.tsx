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
    isDAREnabled: boolean;
    url: string;
}

const TRANSLATION_PATH = "modules.dialogs.DarEnquiryDialog";

const DarEnquiryDialog = ({
    onGeneralEnquiryClick,
    onFeasibilityEnquiryClick,
    isDAREnabled,
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
        <Dialog title={isDAREnabled ? t("titleEnabled") : t("titleNotEnabled")}>
            <MuiDialogContent>
                <Typography mb={2}>
                    {isDAREnabled
                        ? t("messageEnabled")
                        : t("messageNotEnabled")}
                </Typography>
                {!isDAREnabled && (
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
                {isDAREnabled ? (
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
