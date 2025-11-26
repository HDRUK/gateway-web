import { ChipProps, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchQueryParams } from "@/interfaces/Search";
import Box from "@/components/Box";
import Chip from "@/components/Chip";
import ShowMore from "@/components/ShowMore";
import { colors } from "@/config/theme";
import { CloseIcon } from "@/consts/icons";
import { isQueryEmpty } from "@/utils/filters";

interface FilterChipsProps extends ChipProps {
    selectedFilters: { [filter: string]: string[] | undefined };
    handleDelete: (filterType: keyof SearchQueryParams, filter: string) => void;
    filterCategory: string;
}

const TRANSLATION_PATH = "pages.search.components.FilterPanel";

const FilterChips = ({
    selectedFilters,
    handleDelete,
    color = "success",
    size = "small",
    filterCategory,
}: FilterChipsProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    if (isQueryEmpty(selectedFilters)) return null;

    return (
        <Box sx={{ display: "flex", pl: 0, pr: 0 }}>
            <ShowMore
                maxHeight={68}
                sxButton={{
                    color: colors.green700,
                    textDecoration: "underline",
                }}>
                <Box
                    sx={{
                        p: 0,
                        gap: 1,
                        display: "flex",
                        flexWrap: "wrap",
                    }}>
                    {Object.entries(selectedFilters).map(
                        ([filterType, filterValues]) =>
                            Array.isArray(filterValues) &&
                            filterValues
                                .filter(filterValue => filterValue)
                                .map((filter: string) => {
                                    const filterTranslationPath = `filters.${filterCategory}.${filterType}`;

                                    return (
                                        <Tooltip
                                            key={`${filterType}-${filter}`}
                                            title={`${t("filter")}: ${t(
                                                filterTranslationPath
                                            )}`}
                                            placement="top">
                                            <Chip
                                                sx={{
                                                    textOverflow: "ellipsis",
                                                    maxWidth: 200,
                                                    overflow: "hidden",
                                                    whiteSpace: "nowrap",
                                                    marginBottom: "4px",
                                                }}
                                                color={color}
                                                size={size}
                                                label={filter}
                                                onDelete={() =>
                                                    handleDelete(
                                                        filterType as keyof SearchQueryParams,
                                                        filter
                                                    )
                                                }
                                                deleteIcon={<CloseIcon />}
                                            />
                                        </Tooltip>
                                    );
                                })
                    )}
                </Box>
            </ShowMore>
        </Box>
    );
};

export default FilterChips;
