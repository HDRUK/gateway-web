"use client";

import { useForm } from "react-hook-form";
import { DarQuestion } from "@/interfaces/DataAccessRequest";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import { inputComponents } from "@/config/forms";
import { renderFormHydrationField } from "@/utils/formHydration";

interface PreviewTemplateProps {
    questions: DarQuestion[];
}

const PreviewTemplate = ({ questions }: PreviewTemplateProps) => {
    const { control } = useForm();

    return (
        <Paper
            sx={{
                my: 2,
                padding: 2,
            }}>
            {questions.map(question => {
                if (!question) return <Loading />;

                const { title, component, guidance, options, required } =
                    question;

                const field = {
                    name: title,
                    component,
                    info: guidance,
                    required: required,
                    ...(question.component === inputComponents.RadioGroup && {
                        radios: options?.map(option => ({
                            label: option.label,
                            value: option.label,
                        })),
                    }),
                    ...(question.component ===
                        inputComponents.CheckboxGroup && {
                        checkboxes: options?.map(option => ({
                            label: option.label,
                            value: option.label,
                        })),
                    }),
                };

                return renderFormHydrationField(field, control, title);
            })}
        </Paper>
    );
};

export default PreviewTemplate;
