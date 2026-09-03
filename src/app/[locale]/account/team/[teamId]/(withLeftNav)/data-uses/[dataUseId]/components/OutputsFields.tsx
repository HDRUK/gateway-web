"use client";

import { Control, FieldValues, useFieldArray } from "react-hook-form";
import { Button } from "@mui/material";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import { outputsFormArrayFields } from "@/config/forms/dataUse";
import { AddIcon } from "@/consts/icons";

interface OutputsFieldsProps {
    control: Control<FieldValues>;
}

const OutputsFields = ({ control }: OutputsFieldsProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "outputs",
        keyName: "item",
    });

    return (
        <Box sx={{ p: 0 }}>
            {fields.map((field, index) => (
                <Box
                    key={field.item}
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        gap: 2,
                        p: 0,
                        mb: 3,
                        "&:not(:last-of-type)": {
                            borderBottom: 1,
                            borderColor: "greyCustom.light",
                            pb: 3,
                        },
                    }}>
                    {outputsFormArrayFields.map(({ name, ...arrayField }) => (
                        <Box key={name} sx={{ p: 0, gridColumn: "span 6" }}>
                            <InputWrapper
                                {...arrayField}
                                control={control}
                                name={`outputs.${index}.${name}`}
                            />
                        </Box>
                    ))}

                    <Box sx={{ p: 0, gridColumn: "span 12" }}>
                        <Button
                            onClick={() => remove(index)}
                            variant="outlined">
                            Remove output
                        </Button>
                    </Box>
                </Box>
            ))}

            <Button
                onClick={() =>
                    append({
                        type: null,
                        title: null,
                        status: null,
                        detail: null,
                        url: null,
                    })
                }
                startIcon={<AddIcon sx={{ height: 14, width: 14 }} />}>
                Add output
            </Button>
        </Box>
    );
};

export default OutputsFields;
