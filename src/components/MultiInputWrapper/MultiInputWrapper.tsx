"use client";
import React from "react";
import InputWrapper from "@/components/InputWrapper";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { Box } from "@mui/material";
import { Control } from "react-hook-form";

export interface MultiInputWrapperProps {
    fields: any;
    control: Control;
}

type FieldProps = {
    name: string;
    label: string;
    fields?: FieldProps[];
    component: ComponentTypes;
};

const MultiInputWrapper = ({ fields, control }: MultiInputWrapperProps) => {
    const renderField = (field: FieldProps) => {
        if (field.component) {
            return (
                <InputWrapper key={field.name} control={control} {...field} />
            );
        } else if (field.fields) {
            return (
                <>
                    {field.label + ":"}
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
                                    label={""}
                                />
                            </>
                        ))}
                    </Box>
                </>
            );
        }
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
