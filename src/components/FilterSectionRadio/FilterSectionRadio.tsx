"use client";

import { Box } from "@mui/material";
import { FormControlLabel, RadioGroup } from "@mui/material";
import { BucketCheckbox } from "@/interfaces/Filter";
import StyledRadio from "@/components/StyledRadio";
import Typography from "@/components/Typography";

interface FilterSectionRadioProps {
    filterItem: { label: string; value: string; buckets: BucketCheckbox[] };
    handleRadioChange: (key: string) => void;
    value?: string;
    counts?: { [key: string]: number };
}
const FilterSectionRadio = ({
    filterItem,
    handleRadioChange,
    value,
    counts,
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
                        sx={{ width: "100%" }}
                        label={
                            counts !== undefined &&
                            counts[radio.value] !== undefined ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        width: "100%",
                                    }}>
                                    {radio.label}
                                    <Typography>
                                        {counts[radio.value]}
                                    </Typography>
                                </Box>
                            ) : (
                                radio.label
                            )
                        }
                        key={radio.label}
                    />
                ))}
            </RadioGroup>
        </div>
    );
};

export default FilterSectionRadio;
