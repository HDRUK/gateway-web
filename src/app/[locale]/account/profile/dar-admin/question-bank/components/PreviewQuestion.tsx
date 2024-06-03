"use client";

import { Control } from "react-hook-form";
import { Typography } from "@mui/material";
import { FormHydration } from "@/interfaces/FormHydration";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import Paper from "@/components/Paper";
import { renderFormHydrationField } from "@/utils/formHydration";

interface PreviewQuestionProps {
    question: FormHydration;
    control: Control<QuestionBankQuestionForm>;
}

const PreviewQuestion = ({ question, control }: PreviewQuestionProps) => {
    return (
        <Paper
            sx={{
                marginTop: "10px",
                marginBottom: "10px",
                padding: 2,
            }}>
            <Typography> {question?.title} </Typography>
            {question?.field &&
                renderFormHydrationField(
                    question.field,
                    control,
                    question.title
                )}
        </Paper>
    );
};
export default PreviewQuestion;
