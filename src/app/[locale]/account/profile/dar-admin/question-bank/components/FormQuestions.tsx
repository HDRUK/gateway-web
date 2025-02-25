"use client";

import { useMemo } from "react";
import { Control, UseFormWatch } from "react-hook-form";
import { Divider, Typography } from "@mui/material";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import Box from "@/components/Box";
import InputWrapper from "@/components/InputWrapper";
import {
    componentsWithOptions,
    fieldsWithValidation,
    questionFormFields,
    questionValidationFormFields,
} from "@/config/forms/questionBank";
import SelectMultipleOptionsNested from "./SelectMultipleOptionsNested";

interface FormQuestionsProps {
    control: Control;
    componentType: ComponentTypes;
    validationFormat?: string;
    watch: UseFormWatch<QuestionBankQuestionForm>;
}

const FormQuestions = ({
    control,
    componentType,
    validationFormat,
    watch,
}: FormQuestionsProps) => {
    const hydratedFormFields = useMemo(
        () =>
            questionFormFields
                .map(field => {
                    if (
                        field.name === "options" &&
                        !componentsWithOptions.includes(componentType)
                    ) {
                        return undefined;
                    }
                    return field;
                })
                .filter(field => field !== undefined),
        [componentType]
    );

    return (
        <>
            {hydratedFormFields.map(field => {
                if (field.component === "FieldArray") {
                    return (
                        <SelectMultipleOptionsNested
                            control={control}
                            {...field}
                            name={field.name}
                            watch={watch}
                        />
                    );
                }

                return (
                    <InputWrapper
                        key={field.name}
                        control={control}
                        {...field}
                        name={field.name}
                        showClearButton={false}
                    />
                );
            })}

            {fieldsWithValidation.includes(componentType) && (
                <Box sx={{ p: 0 }}>
                    <Divider sx={{ mb: 2.5 }} />
                    <Typography sx={{ mb: 2 }}>Validation</Typography>

                    {questionValidationFormFields
                        .filter(
                            field =>
                                field.applicableToComponent.includes(
                                    componentType
                                ) &&
                                (!field.applicableToOption ||
                                    validationFormat ===
                                        field.applicableToOption)
                        )
                        .map(field => (
                            <InputWrapper
                                key={field.name}
                                control={control}
                                {...field}
                                name={field.name}
                            />
                        ))}
                </Box>
            )}
        </>
    );
};
export default FormQuestions;
