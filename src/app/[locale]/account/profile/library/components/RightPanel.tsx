"use client";

import { useMemo } from "react";
import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import { SelectedLibrary } from "@/interfaces/Library";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import useSidebar from "@/hooks/useSidebar";
import theme from "@/config/theme";
import { QuestionAnswerIcon, DeleteForeverIcon } from "@/consts/icons";
import FeasibilityEnquirySidebar from "@/app/[locale]/(logged-out)/search/components/FeasibilityEnquirySidebar";
import GeneralEnquirySidebar from "@/app/[locale]/(logged-out)/search/components/GeneralEnquirySidebar";

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
                };
            });
    }, [selected]);

    const selectedLibraryIds = useMemo(
        () => Object.keys(selected).filter(key => selected[key].selected),
        [selected]
    );

    const handleGeneralEnquiries = () => {
        showSidebar({
            title: "Messages",
            content: <GeneralEnquirySidebar datasets={selectedDatasets} />,
        });
    };

    const handleFeasibilityEnquiries = () => {
        showSidebar({
            title: "Messages",
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
                    <Button
                        onClick={handleGeneralEnquiries}
                        sx={{ mt: 2, width: "100%" }}>
                        <QuestionAnswerIcon sx={{ pr: 1 }} />
                        {t("generalEnquiries.buttonText")}
                    </Button>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ p: 0 }}>
                    <Typography variant="h2">
                        {t("feasabilityEnquiries.title")}
                    </Typography>
                    <Typography>{t("feasabilityEnquiries.text")}</Typography>
                    <Button
                        onClick={handleFeasibilityEnquiries}
                        sx={{ mt: 2, width: "100%" }}>
                        <QuestionAnswerIcon sx={{ pr: 1 }} />
                        {t("feasabilityEnquiries.buttonText")}
                    </Button>
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
