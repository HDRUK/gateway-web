"use client";

import { useMemo } from "react";
import InputWrapper from "@/components/InputWrapper";
import { questionFormFields } from "@/config/forms/questionBank";

interface FormQuestionsProps {
    control: unknown;
    setValue: unknown;
    showOptions: boolean;
}

const FormQuestions = ({
    control,
    setValue,
    showOptions,
}: FormQuestionsProps) => {
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
            {hydratedFormFields.map(field => (
                <InputWrapper
                    key={field.name}
                    control={control}
                    setValue={setValue}
                    {...field}
                    name={field.name}
                />
            ))}
        </>
    );
};
export default FormQuestions;
