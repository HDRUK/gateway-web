"use client";

import { Fragment } from "react";
import { Control } from "react-hook-form";
import { Box } from "@mui/material";
import { FormField } from "@/interfaces/FormField";
import InputWrapper from "@/components/InputWrapper";

export interface MultiInputWrapperProps {
    fields: FormField[];
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
                        {field.fields?.map(subField => (
                            <Fragment key={subField.name}>
                                {subField.label}
                                <InputWrapper
                                    formControlSx={{
                                        p: 0,
                                        mx: 2,
                                        my: "auto",
                                    }}
                                    control={control}
                                    {...subField}
                                    label=""
                                />
                            </Fragment>
                        ))}
                    </Box>
                </>
            );
        }
        return null;
    };

    return (
        <Box sx={{ p: 0 }}>
            {fields.map((field: FormField) => (
                <Box
                    key={field.name}
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
