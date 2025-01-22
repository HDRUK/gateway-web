"use client";

import { useMemo } from "react";
import { FileUploadOutlined } from "@mui/icons-material";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { SelectedLibrary } from "@/interfaces/Library";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import Tooltip from "@/components/Tooltip";
import Typography from "@/components/Typography";
import FeasibilityEnquirySidebar from "@/modules/FeasibilityEnquirySidebar";
import GeneralEnquirySidebar from "@/modules/GeneralEnquirySidebar";
import useSidebar from "@/hooks/useSidebar";
import theme from "@/config/theme";
import { QuestionAnswerIcon, DeleteForeverIcon } from "@/consts/icons";

const TRANSLATION_PATH = "pages.account.profile.library.components.RightPanel";

interface RightPanelProps {
    selected: SelectedLibrary;
    handleRemove: (id: string) => void;
}

const RightPanel = ({ selected, handleRemove }: RightPanelProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const { showSidebar } = useSidebar();

    const selectedDatasets = useMemo(() => {
        return Object.values(selected)
            .filter(item => item.selected)
            .map(item => {
                return {
                    datasetId: Number(item.datasetId),
                    name: item.name,
                    teamId: Number(item.teamId),
                    teamName: item.teamName,
                    teamMemberOf: item.teamMemberOf,
                    darEnabled: item.darEnabled,
                };
            });
    }, [selected]);

    const selectedLibraryIds = useMemo(
        () => Object.keys(selected).filter(key => selected[key].selected),
        [selected]
    );

    const handleGeneralEnquiries = () => {
        showSidebar({
            title: t("generalEnquiries.sidebarTitle"),
            content: <GeneralEnquirySidebar datasets={selectedDatasets} />,
        });
    };

    const handleFeasibilityEnquiries = () => {
        showSidebar({
            title: t("feasibilityEnquiries.sidebarTitle"),
            content: <FeasibilityEnquirySidebar datasets={selectedDatasets} />,
        });
    };

    const handleMultiDelete = () => {
        selectedLibraryIds.forEach(id => handleRemove(id));
    };

    return (
        <Paper sx={{ mb: 2 }}>
            <Box
                sx={{
                    bgcolor: "white",
                    p: 2,
                    gap: 2,
                    alignItems: "center",
                }}>
                <Box sx={{ p: 0 }}>
                    <Typography variant="h2">
                        {t("generalEnquiries.title")}
                    </Typography>
                    <Typography>{t("generalEnquiries.text")}</Typography>
                    <Tooltip
                        title={
                            selectedDatasets.length > 0
                                ? ""
                                : t("generalEnquiries.buttonTooltip")
                        }>
                        <Button
                            onClick={handleGeneralEnquiries}
                            sx={{ mt: 2, width: "100%" }}
                            disabled={!(selectedDatasets.length > 0)}>
                            <QuestionAnswerIcon sx={{ pr: 1 }} />
                            {t("generalEnquiries.buttonText")}
                        </Button>
                    </Tooltip>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 0 }}>
                    <Typography variant="h2">
                        {t("feasibilityEnquiries.title")}
                    </Typography>
                    <Typography>{t("feasibilityEnquiries.text")}</Typography>
                    <Tooltip
                        title={
                            selectedDatasets.length > 0
                                ? ""
                                : t("feasibilityEnquiries.buttonTooltip")
                        }>
                        <Button
                            onClick={handleFeasibilityEnquiries}
                            sx={{ mt: 2, width: "100%" }}
                            disabled={!(selectedDatasets.length > 0)}>
                            <QuestionAnswerIcon sx={{ pr: 1 }} />
                            {t("feasibilityEnquiries.buttonText")}
                        </Button>
                    </Tooltip>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 0 }}>
                    <Typography variant="h2">
                        {t("dataAccessRequest.title")}
                    </Typography>
                    <Typography>{t("dataAccessRequest.text")}</Typography>
                    <Tooltip
                        title={
                            !selectedDatasets.every(
                                dataset => dataset.darEnabled
                            )
                                ? t("dataAccessRequest.buttonTooltipDar")
                                : selectedDatasets.length > 0
                                ? ""
                                : t("dataAccessRequest.buttonTooltip")
                        }>
                        <Button
                            sx={{ mt: 2, width: "100%" }}
                            disabled={
                                !(selectedDatasets.length > 0) ||
                                !selectedDatasets.every(
                                    dataset => dataset.darEnabled
                                )
                            }>
                            <FileUploadOutlined sx={{ pr: 1 }} />
                            {t("dataAccessRequest.buttonText")}
                        </Button>
                    </Tooltip>
                </Box>
                {selectedDatasets.length > 1 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Box
                            sx={{
                                p: 2,
                                m: 0,
                                backgroundColor: theme.palette.greyCustom.main,
                            }}>
                            <Button
                                color="greyCustom"
                                variant="outlined"
                                onClick={handleMultiDelete}
                                sx={{
                                    width: "100%",
                                    backgroundColor: "greyCustom.light",
                                }}>
                                <DeleteForeverIcon
                                    color="primary"
                                    sx={{ pr: 1 }}
                                />
                                {t("multiDelete.label")}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </Paper>
    );
};

export default RightPanel;
