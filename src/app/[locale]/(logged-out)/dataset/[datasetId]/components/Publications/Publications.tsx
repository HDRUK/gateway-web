"use client";

import { useTranslations } from "next-intl";
import Paper from "@/components/Paper";

const TRANSLATION_PATH = "pages.dataset";

const Publications = () => {
    const t = useTranslations(TRANSLATION_PATH);
    // to be implemented at a future point....
    return (
        <Paper sx={{ borderRadius: 2, p: 2 }}>{t("datasetPublications")}</Paper>
    );
};

export default Publications;
