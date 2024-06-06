"use client";

import MuiSwitch from "@mui/material/Switch";
import { useTranslations } from "next-intl";
import { BucketCheckbox } from "@/interfaces/Filter";
import Box from "@/components/Box";
import TooltipIcon from "@/components/TooltipIcon";
import Typography from "@/components/Typography";

const TRANSLATION_PATH = "pages.search.components.FilterPanel.filters";
const TOOLTIP_SUFFIX = "Tooltip";

interface FilterSectionInlineSwitchProps {
    filterCategory: string;
    filterItem: { label: string; value: string; buckets: BucketCheckbox[] };
    selectedFilters: { [filter: string]: string[] | undefined };
    handleRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const FilterSectionInlineSwitch = ({
    filterCategory,
    filterItem,
    selectedFilters,
    handleRadioChange,
}: FilterSectionInlineSwitchProps) => {
    const t = useTranslations(`${TRANSLATION_PATH}.${filterCategory}`);

    const { label } = filterItem;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
            <Typography fontWeight="400" fontSize="20px">
                {t(label)}
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    p: 0,
                }}>
                <TooltipIcon
                    buttonSx={{ p: 0 }}
                    size="small"
                    label=""
                    content={t(`${label}${TOOLTIP_SUFFIX}`)}
                />
                <MuiSwitch
                    disableRipple
                    onChange={handleRadioChange}
                    checked={!!selectedFilters[filterItem.label]?.length}
                />
            </Box>
        </Box>
    );
};

export default FilterSectionInlineSwitch;
