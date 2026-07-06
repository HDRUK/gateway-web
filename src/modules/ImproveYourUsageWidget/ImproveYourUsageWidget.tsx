"use client";

import { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { useTranslations } from "next-intl";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { ArrowBack, ArrowForward } from "@/consts/icons";

const TRANSLATION_PATH = "pages.account.dashboard.improveUsage";
const TIP_TRANSLATION_KEYS = ["demographicMetadata", "metadataDescriptions"];

const ImproveYourUsageWidget = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const [index, setIndex] = useState(0);

    const showTip = (next: number) =>
        setIndex(
            (next + TIP_TRANSLATION_KEYS.length) % TIP_TRANSLATION_KEYS.length
        );

    return (
        <Paper sx={{ p: 2, height: "100%" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                }}>
                <Typography variant="h2">{t("title")}</Typography>
                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                    <IconButton
                        color="primary"
                        aria-label={t("previousLabel")}
                        onClick={() => showTip(index - 1)}>
                        <ArrowBack />
                    </IconButton>
                    <IconButton
                        color="primary"
                        aria-label={t("nextLabel")}
                        onClick={() => showTip(index + 1)}>
                        <ArrowForward />
                    </IconButton>
                </Box>
            </Box>
            <Typography aria-live="polite" aria-atomic>
                {t.rich(`tips.${TIP_TRANSLATION_KEYS[index]}`, {
                    b: chunks => <strong>{chunks}</strong>,
                })}
            </Typography>
        </Paper>
    );
};

export default ImproveYourUsageWidget;
