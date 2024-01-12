"use client";

import React from "react";
import { Control } from "react-hook-form";
import { Box } from "@mui/material";
import { FormField } from "@/interfaces/FormField";
import InputWrapper from "@/components/InputWrapper";

export interface MultiInputWrapperProps {
    fields: FormField;
    control: Control;
}

const MultiInputWrapper = ({ fields, control }: MultiInputWrapperProps) => {
    const renderField = (field: FormField) => {
        if (field.component) {
            return (
                <InputWrapper key={field.name} control={control} {...field} />
            );
        }
        if (field.fields) {
            return (
                <>
                    {field.label}
                    <Box
                        key={field.name}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            py: 1,
                            my: 1,
                        }}>
                        {field.fields.map(subField => (
                            <>
                                {subField.label}
                                <InputWrapper
                                    formControlSx={{
                                        p: 0,
                                        mx: 2,
                                        my: "auto",
                                    }}
                                    key={subField.name}
                                    control={control}
                                    {...subField}
                                    label=""
                                />
                            </>
                        ))}
                    </Box>
                </>
            );
        }
        return null;
    };

    return (
        <Box sx={{ p: 0 }}>
            {fields.map((field: FieldProps) => (
                <Box
                    sx={{
                        py: 1,
                        my: 1,
                    }}>
                    {renderField(field)}
                </Box>
            ))}
        </Box>
    );
};

export default MultiInputWrapper;
