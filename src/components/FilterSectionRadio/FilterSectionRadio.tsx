"use client";

import { FormControlLabel, RadioGroup } from "@mui/material";
import { BucketCheckbox } from "@/interfaces/Filter";
import StyledRadio from "@/components/StyledRadio";

interface FilterSectionRadioProps {
    filterItem: { label: string; value: string; buckets: BucketCheckbox[] };
    handleRadioChange: (key: string) => void;
    value?: string;
}
const FilterSectionRadio = ({
    filterItem,
    handleRadioChange,
    value,
}: FilterSectionRadioProps) => {
    const { buckets } = filterItem;

    return (
        <div style={{ height: 80 }}>
            <RadioGroup
                name={`controlled-radio-${filterItem}`}
                onChange={(_event, value) => handleRadioChange(value)}
                value={value}>
                {buckets.map(radio => (
                    <FormControlLabel
                        value={radio.value}
                        control={<StyledRadio />}
                        label={radio.label}
                    />
                ))}
            </RadioGroup>
        </div>
    );
};

export default FilterSectionRadio;
