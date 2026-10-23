"use client";

import { FieldValues } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/SearchBar";
import { QUERY_FIELD } from "@/config/forms/search";
import { DEFAULT_EXPLAINER_KEY, EXPLAINER_KEYS } from "../../constants";
import { headerContent, headerRoot, headerTitle } from "./SearchHeader.styles";

const TRANSLATION_PATH = "pages.search";

interface SearchHeaderProps {
    type: string;
    query?: string;
    onSubmit: (data: FieldValues) => void;
    onReset: () => void;
    onInputClick?: () => void;
    valueOverride?: string;
}

const SearchHeader = ({
    type,
    query,
    onSubmit,
    onReset,
    onInputClick,
    valueOverride,
}: SearchHeaderProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    return (
        <Box sx={headerRoot}>
            <Box sx={headerContent}>
                <Typography variant="h1" sx={headerTitle}>
                    {t("searchHeader")}
                </Typography>
                <SearchBar
                    defaultValue={query}
                    explainerText={t(
                        EXPLAINER_KEYS[type] ?? DEFAULT_EXPLAINER_KEY
                    )}
                    resetAction={onReset}
                    isDisabled={!query}
                    submitAction={onSubmit}
                    queryPlaceholder={t("searchPlaceholder")}
                    queryName={QUERY_FIELD}
                    inputOverrideAction={onInputClick}
                    valueOverride={valueOverride}
                />
            </Box>
        </Box>
    );
};

export default SearchHeader;
