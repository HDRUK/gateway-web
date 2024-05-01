"use client";

import { useTranslations } from "next-intl";
import BackButton from "@/components/BackButton";
import { ActionBarWrapper } from "./ActionBar.styles";

const TRANSLATION_PATH = "pages.dataUse.components.ActionBar";

const ActionBar = () => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <ActionBarWrapper>
            <BackButton label={t("label")} style={{ margin: 0 }} />
        </ActionBarWrapper>
    );
};

export default ActionBar;
