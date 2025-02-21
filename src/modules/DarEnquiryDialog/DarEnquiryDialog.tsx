"use client";

import { Button } from "@mui/material";
import MuiDialogActions from "@mui/material/DialogActions";
import MuiDialogContent from "@mui/material/DialogContent";
import { useTranslations } from "next-intl";
import Dialog from "@/components/Dialog";
import { MarkDownSanitizedWithHtml } from "@/components/MarkDownSanitizedWithHTML";
import Typography from "@/components/Typography";
import useDialog from "@/hooks/useDialog";
import { GlobalDialogContextProps } from "@/providers/DialogProvider";

export interface DarEnquiryDialogProps {
    onGeneralEnquiryClick(): void;
    onFeasibilityEnquiryClick(): void;
    createDARApplication({
        datasetIds,
        teamIds,
        redirectPath,
    }: {
        datasetIds: number[];
        teamIds: number[];
        redirectPath?: string;
    }): void;
    isDarEnabled: boolean;
    url: string;
    modalHeader?: string;
    modalContent?: string;
    datasetIds: number[];
    teamIds: number[];
    redirectPath?: string;
}

const TRANSLATION_PATH = "modules.dialogs.DarEnquiryDialog";

const DarEnquiryDialog = ({
    onGeneralEnquiryClick,
    onFeasibilityEnquiryClick,
    createDARApplication,
    isDarEnabled,
    modalHeader,
    modalContent,
    url,
    datasetIds,
    teamIds,
    redirectPath,
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

    return (
        <Dialog title={dialogTitle}>
            <MuiDialogContent>
                {modalContent ? (
                    <MarkDownSanitizedWithHtml content={modalContent} />
                ) : (
                    <Typography mb={2}>{t("messageNotEnabled")}</Typography>
                )}

                {!isDarEnabled && (
                    <Typography>
                        {t.rich("messageNotEnabledOtherInstructions", {
                            // eslint-disable-next-line react/no-unstable-nested-components
                            generalEnquiryLink: () => (
                                <Button
                                    aria-label="general"
                                    variant="link"
                                    onClick={handleGeneralEnquiry}>
                                    {t("generalEnquiryLink")}
                                </Button>
                            ),
                            // eslint-disable-next-line react/no-unstable-nested-components
                            feasabilityEnquiryLink: () => (
                                <Button
                                    aria-label="feasibility"
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
                    <Button
                        variant="contained"
                        onClick={() => {
                            hideDialog();
                            createDARApplication({
                                datasetIds,
                                teamIds,
                                redirectPath,
                            });
                        }}>
                        {t("requestAccessButton")}
                    </Button>
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
