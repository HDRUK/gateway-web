"use client";
import React from "react";
import InputWrapper from "@/components/InputWrapper";
import { Box } from "@mui/material";
import { Control } from "react-hook-form";

export interface MultiInputWrapperProps {
    fields: any;
    control: Control;
}

const MultiInputWrapper = ({ fields, control }: MultiInputWrapperProps) => {
    return (
        <Box component="form" sx={{ p: 0 }}>
            {fields.map(field => {
                if (field.component) {
                    return (
                        <InputWrapper
                            key={field.name}
                            control={control}
                            {...field}
                        />
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
            })}
        </Box>
    );
};

export default MultiInputWrapper;
