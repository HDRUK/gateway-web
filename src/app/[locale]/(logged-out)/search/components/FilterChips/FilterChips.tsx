import { ChipProps } from "@mui/material";
import { useTranslations } from "next-intl";
import { SearchQueryParams } from "@/interfaces/Search";
import Box from "@/components/Box";
import Chip from "@/components/Chip";
import ShowMore from "@/components/ShowMore";
import Tooltip from "@/components/Tooltip";
import Typography from "@/components/Typography";
import { isQueryEmpty } from "@/utils/filters";

interface FilterChipsProps extends ChipProps {
    selectedFilters: { [filter: string]: string[] | undefined };
    label: string;
    handleDelete: (filterType: keyof SearchQueryParams, filter: string) => void;
    filterCategory: string;
}

const TRANSLATION_PATH = "pages.search.components.FilterPanel";

const FilterChips = ({
    selectedFilters,
    handleDelete,
    color = "success",
    size = "small",
    label,
    filterCategory,
}: FilterChipsProps) => {
    const t = useTranslations(TRANSLATION_PATH);

    if (isQueryEmpty(selectedFilters)) return null;

    return (
        <Box sx={{ display: "flex" }}>
            <Typography sx={{ fontWeight: 700, mr: 1, whiteSpace: "nowrap" }}>
                {label}:
            </Typography>
            <ShowMore maxHeight={28}>
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
                                            title={`${t("filter")}: ${t(
                                                filterTranslationPath
                                            )}`}
                                            placement="top">
                                            <Chip
                                                key={`${filterType}-${filter}`}
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
