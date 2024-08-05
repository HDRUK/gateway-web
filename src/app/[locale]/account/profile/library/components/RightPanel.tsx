"use client";

import { useTranslations } from "next-intl";
import Box from "@/components/Box";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";

const TRANSLATION_PATH = "pages.account.profile.library.components.RightPanel";

const RightPanel = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Paper sx={{ mb: 2 }}>
            <Box
                sx={{
                    bgcolor: "white",
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                }}>
                <Box sx={{ flexGrow: 1, p: 0 }}>
                    <Typography variant="h2">
                        {t("generalEnquiries.title")}
                    </Typography>
                    <Typography>{t("generalEnquiries.text")}</Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default RightPanel;
