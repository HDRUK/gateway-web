"use client";

import { useForm } from "react-hook-form";
import { DarQuestion } from "@/interfaces/DataAccessRequest";
import Loading from "@/components/Loading";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { renderFormHydrationField } from "@/utils/formHydration";

interface PreviewTemplateProps {
    questions: DarQuestion[];
}

const PreviewTemplate = ({ questions }: PreviewTemplateProps) => {
    const { control } = useForm({});

    return (
        <Paper
            sx={{
                marginTop: "10px",
                marginBottom: "10px",
                padding: 2,
            }}>
            {questions.map(question => {
                const hydration = question.question_json;
                if (!hydration.field) return <Loading />;

                return (
                    <>
                        <Typography> {hydration.title} </Typography>
                        {renderFormHydrationField(
                            hydration.field,
                            control,
                            hydration.title
                        )}
                    </>
                );
            })}
        </Paper>
    );
};

export default PreviewTemplate;
