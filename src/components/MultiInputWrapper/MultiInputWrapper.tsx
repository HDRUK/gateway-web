"use client";

import { Fragment } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Box } from "@mui/material";
import { FormField } from "@/interfaces/FormField";
import InputWrapper from "@/components/InputWrapper";

export interface MultiInputWrapperProps<
    TFieldValues extends FieldValues,
    TName
> {
    fields: FormField<TName>[];
    control: Control<TFieldValues>;
}

const MultiInputWrapper = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    fields,
    control,
}: MultiInputWrapperProps<TFieldValues, TName>) => {
    const renderField = (field: FormField<TName>) => {
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
                        key={field.name as string}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            py: 1,
                            my: 1,
                        }}>
                        {field.fields?.map(subField => (
                            <Fragment key={subField.name as string}>
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
            {fields.map((field: FormField<TName>) => (
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
