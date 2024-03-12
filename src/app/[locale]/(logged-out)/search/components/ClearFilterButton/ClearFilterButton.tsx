"use client";

import { useTranslations } from "next-intl";
import { ClearButton } from "./ClearFilterButton.styles";

const TRANSLATION_PATH = "pages.search.components.FilterPanel";

const ClearFilterButton = ({
    checkboxValues,
    resetFilterSection,
}: {
    checkboxValues: { [key: string]: boolean };
    resetFilterSection: () => void;
}) => {
    const t = useTranslations(TRANSLATION_PATH);

    const filterItemCount = Object.values(checkboxValues).filter(
        value => value === true
    ).length;

    return (
        <ClearButton
            variant="link"
            onClick={resetFilterSection}
            disabled={!filterItemCount}>
            {t("clearFilter")} ({filterItemCount})
        </ClearButton>
    );
};

export default ClearFilterButton;
