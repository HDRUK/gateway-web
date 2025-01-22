"use client";

import { useMemo } from "react";
import { Control, UseFormWatch } from "react-hook-form";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import InputWrapper from "@/components/InputWrapper";
import { questionFormFields } from "@/config/forms/questionBank";
import SelectMultipleOptionsNested from "./SelectMultipleOptionsNested";

interface FormQuestionsProps {
    control: Control;
    showOptions: boolean;
    watch: UseFormWatch<QuestionBankQuestionForm>;
}

const FormQuestions = ({ control, showOptions, watch }: FormQuestionsProps) => {
    const hydratedFormFields = useMemo(
        () =>
            questionFormFields
                .map(field => {
                    if (field.name === "options" && !showOptions) {
                        return undefined;
                    }
                    return field;
                })
                .filter(field => field !== undefined),
        [showOptions]
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
        </>
    );
};
export default FormQuestions;
