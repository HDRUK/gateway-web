"use client";

import { useTranslations } from "next-intl";
import { ClearButton } from "./ClearFilterButton.styles";

const TRANSLATION_PATH = "pages.search.components.FilterPanel";

const ClearFilterButton = ({
    checkboxValues,
    nestedCheckboxValues,
    resetFilterSection,
}: {
    checkboxValues: { [key: string]: boolean };
    nestedCheckboxValues?: { [key: string]: boolean };
    resetFilterSection: () => void;
}) => {
    const t = useTranslations(TRANSLATION_PATH);

    const filterItemCount =
        (checkboxValues &&
            Object.values(checkboxValues).filter(value => value === true)
                .length) +
            ((nestedCheckboxValues &&
                Object.values(nestedCheckboxValues).filter(
                    value => value === true
                ).length) ||
                0) || 0;

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
