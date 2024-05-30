"use client";

import { useForm } from "react-hook-form";
import { QuestionBankQuestion } from "@/interfaces/QuestionBankQuestion";
import Paper from "@/components/Paper";
import Typography from "@/components/Typography";
import { renderFormHydrationField } from "@/utils/formHydration";

interface PreviewTemplateProps {
    questions: QuestionBankQuestion[];
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
                // if (question) return;
                console.log(question);
                return (
                    <>
                        <Typography> {question?.task?.guidance} </Typography>
                        {renderFormHydrationField(
                            question.task.field,
                            control,
                            "name"
                        )}
                    </>
                );
            })}
        </Paper>
    );
};

export default PreviewTemplate;
