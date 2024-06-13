"use client";

import { useTranslations } from "next-intl";
import BackButton from "@/components/BackButton";

const TRANSLATION_PATH = "pages.collection.components.ActionBar";

const ActionBar = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return <BackButton label={t("label")} style={{ margin: 0 }} />;
};

export default ActionBar;
