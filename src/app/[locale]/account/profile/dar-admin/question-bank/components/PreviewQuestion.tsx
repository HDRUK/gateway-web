"use client";

import { useMemo } from "react";
import { Control } from "react-hook-form";
import { FormHydration, FormHydrationField } from "@/interfaces/FormHydration";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import Paper from "@/components/Paper";
import { inputComponents } from "@/config/forms";
import { componentsWithOptions } from "@/config/forms/questionBank";
import { renderFormHydrationField } from "@/utils/formHydration";

interface PreviewQuestionProps {
    question: FormHydration;
    control: Control<QuestionBankQuestionForm>;
}

const formatNestedFields = data =>
    data.options.map(option => ({
        active_when: option.label,
        fields: option.children.map(child => ({
            component: child.component,
            info: child.guidance || "",
            name: child.title || "",
            ...(child.component === inputComponents.RadioGroup && {
                radios: child?.options?.map(option => ({
                    label: option.label,
                    value: option.label,
                })),
            }),
            ...(child.component === inputComponents.CheckboxGroup && {
                checkboxes: child?.options?.map(option => ({
                    label: option.label,
                    value: option.label,
                })),
            }),
        })),
    }));

const PreviewQuestion = ({ question, control }: PreviewQuestionProps) => {
    const formattedQuestion = useMemo(() => {
        return {
            title: question.title || "",
            field: {
                name: question.title,
                component: question.component,
                info: question?.guidance || "",
                ...(question.component === inputComponents.RadioGroup && {
                    radios: question?.options?.map(option => ({
                        label: option.label,
                        value: option.label,
                    })),
                }),
                ...(question.component === inputComponents.CheckboxGroup && {
                    checkboxes: question?.options?.map(option => ({
                        label: option.label,
                        value: option.label,
                    })),
                }),
            },
            nested: formatNestedFields(question),
        };
    }, [question]);

    return (
        <Paper
            sx={{
                my: 2,
                padding: 2,
            }}>
            {formattedQuestion?.field &&
                renderFormHydrationField(
                    formattedQuestion.field as FormHydrationField,
                    control,
                    question.title
                )}

            {/* //todo - get current val to decide what field to show */}
            {componentsWithOptions.includes(
                formattedQuestion?.field.component
            ) &&
                !!formattedQuestion.nested?.length &&
                formattedQuestion.nested[1]?.fields?.map(field =>
                    renderFormHydrationField(
                        field as FormHydrationField,
                        control,
                        field.title
                    )
                )}
        </Paper>
    );
};
export default PreviewQuestion;
