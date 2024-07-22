"use client";

import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import BackButton from "@/components/BackButton";
import { SpeechBubbleIcon } from "@/consts/customIcons";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataCustodian.components.ActionBar";

const ActionBar = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <ActionBarWrapper>
            <BackButton label={t("label")} style={{ margin: 0 }} />

            <Box sx={{ display: "flex", gap: 1, p: 0 }}>
                <Button
                    color="primary"
                    variant="contained"
                    startIcon={<SpeechBubbleIcon />}>
                    {t("enquire")}
                </Button>
            </Box>
        </ActionBarWrapper>
    );
};

export default ActionBar;
