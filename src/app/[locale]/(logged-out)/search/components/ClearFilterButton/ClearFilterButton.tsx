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

    return (
        <ClearButton variant="text" onClick={resetFilterSection}>
            {t("clearFilter")}
            <span>
                (
                {
                    Object.values(checkboxValues).filter(
                        value => value === true
                    ).length
                }
                )
            </span>
        </ClearButton>
    );
};

export default ClearFilterButton;
