"use client";

import { useMemo } from "react";
import { Control } from "react-hook-form";
import { Typography } from "@mui/material";
import { FormHydration, FormHydrationField } from "@/interfaces/FormHydration";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import Paper from "@/components/Paper";
import { renderFormHydrationField } from "@/utils/formHydration";

interface PreviewQuestionProps {
    question: FormHydration;
    control: Control<QuestionBankQuestionForm>;
}

const PreviewQuestion = ({ question, control }: PreviewQuestionProps) => {
    const formattedQuestion = useMemo(() => {
        const options = question.field?.options || {};

        const formattedField = {
            ...question.field,
            ...(question.field?.component === "RadioGroup" && {
                radios: Object.values(options).map(value => ({
                    label: value,
                    value,
                })),
            }),
            ...(question.field?.component === "CheckboxGroup" && {
                checkboxes: Object.values(options).map(value => ({
                    label: value,
                    value,
                })),
            }),
        };

        return {
            ...question,
            field: formattedField,
        };
    }, [question]);

    return (
        <Paper
            sx={{
                my: 2,
                padding: 2,
            }}>
            <Typography>{question?.title}</Typography>
            {question?.field &&
                renderFormHydrationField(
                    formattedQuestion.field as FormHydrationField,
                    control,
                    question.title
                )}
        </Paper>
    );
};
export default PreviewQuestion;
