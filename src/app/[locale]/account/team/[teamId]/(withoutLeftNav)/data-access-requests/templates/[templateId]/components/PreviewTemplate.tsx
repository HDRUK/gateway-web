"use client";

import { useForm } from "react-hook-form";
import { DarQuestion } from "@/interfaces/DataAccessRequest";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
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
                const hydration = question.question_json;
                const { title, guidance } = question;
                if (!hydration.field) return <Loading />;

                const formField = {
                    ...hydration.field,
                    required: question.required === 1,
                    label: title,
                    info: guidance,
                };

                return renderFormHydrationField(
                    formField,
                    control,
                    hydration.title
                );
            })}
        </Paper>
    );
};

export default PreviewTemplate;
