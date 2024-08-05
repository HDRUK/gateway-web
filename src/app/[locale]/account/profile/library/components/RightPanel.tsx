"use client";

import { Divider } from "@mui/material";
import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { QuestionAnswerIcon } from "@/consts/icons";

const TRANSLATION_PATH = "pages.account.profile.library.components.RightPanel";

interface SelectionData {
    [id: string]: boolean;
}
interface RightPanelProps {
    selected: SelectionData;
}

const RightPanel = ({ selected }: RightPanelProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    const handleGeneralEnquiries = () => {
        // to be implemented
        const selectedDatasetIds = Object.keys(selected).filter(
            key => selected[key]
        );
        console.log(selectedDatasetIds);
    };

    const handleFeasibilityEnquiries = () => {
        // to be implemented
        const selectedDatasetIds = Object.keys(selected).filter(
            key => selected[key]
        );
        console.log(selectedDatasetIds);
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
            </Box>
        </Paper>
    );
};

export default RightPanel;
