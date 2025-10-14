"use client";

import { useId } from "react";
import { SxProps, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { BucketCheckbox } from "@/interfaces/Filter";
import Box from "@/components/Box";
import CheckboxControlled from "@/components/CheckboxControlled";
import { colors } from "@/config/theme";

const TRANSLATION_PATH = "pages.search.components.FilterPanel.filters";
const TOOLTIP_SUFFIX = "Tooltip";

interface FilterSectionInlineSwitchProps {
    filterCategory: string;
    filterItem: { label: string; value: string; buckets: BucketCheckbox[] };
    selectedFilters: { [filter: string]: string[] | undefined };
    containerSx?: SxProps;
    handleRadioChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const FilterSectionInlineSwitch = ({
    filterCategory,
    filterItem,
    selectedFilters,
    containerSx,
    handleRadioChange,
}: FilterSectionInlineSwitchProps) => {
    const t = useTranslations(`${TRANSLATION_PATH}.${filterCategory}`);
    const id = useId();
    const { label } = filterItem;
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: colors.white,
                p: 0,
                pl: 0,
                ...containerSx,
            }}>
            <Tooltip
                describeChild
                placement="right"
                title={t(`${label}${TOOLTIP_SUFFIX}`)}>
                <div>
                    <CheckboxControlled
                        label={t(label)}
                        id={id}
                        disableRipple
                        checked={!!selectedFilters[filterItem.label]?.length}
                        onChange={handleRadioChange}
                        name={t(label)}
                    />
                </div>
            </Tooltip>
        </Box>
    );
};

export default FilterSectionInlineSwitch;
