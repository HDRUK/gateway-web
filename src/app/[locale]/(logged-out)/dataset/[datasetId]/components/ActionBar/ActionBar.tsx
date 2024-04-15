"use client";

import { useTranslations } from "next-intl";
import BackButton from "@/components/BackButton";
import Box from "@/components/Box";
import Button from "@/components/Button";
import { DownloadIcon } from "@/consts/icons";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataset.components.ActionBar";

const ActionBar = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <ActionBarWrapper>
            <BackButton label="Back to search results" style={{ margin: 0 }} />

            <Box sx={{ display: "flex", gap: 1, p: 0 }}>
                <Button disabled>{t("contact")}</Button>

                <Button variant="outlined" color="secondary" disabled>
                    {t("submitApplication")}
                </Button>

                <Button variant="text" startIcon={<DownloadIcon />} disabled>
                    {t("downloadMetadata")}
                </Button>
            </Box>
        </ActionBarWrapper>
    );
};

export default ActionBar;
