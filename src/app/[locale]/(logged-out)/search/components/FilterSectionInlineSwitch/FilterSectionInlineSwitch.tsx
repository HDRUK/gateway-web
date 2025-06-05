"use client";

import { useId } from "react";
import { Tooltip } from "@mui/material";
import MuiSwitch from "@mui/material/Switch";
import { useTranslations } from "next-intl";
import { BucketCheckbox } from "@/interfaces/Filter";
import Box from "@/components/Box";
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
    const id = useId();
    const { label } = filterItem;

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
            <Tooltip
                describeChild
                tabIndex={0}
                title={t(`${label}${TOOLTIP_SUFFIX}`)}>
                <div>
                    <Typography
                        fontWeight="400"
                        fontSize={20}
                        component="label"
                        for={id}>
                        {t(label)}
                    </Typography>
                </div>
            </Tooltip>
            <MuiSwitch
                id={id}
                disableRipple
                onChange={handleRadioChange}
                checked={!!selectedFilters[filterItem.label]?.length}
            />
        </Box>
    );
};

export default FilterSectionInlineSwitch;
