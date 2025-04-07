"use client";

import { Control } from "react-hook-form";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import {
    QuestionBankQuestion,
    QuestionBankQuestionForm,
} from "@/interfaces/QuestionBankQuestion";
import Paper from "@/components/Paper";
import { formatDarQuestion } from "@/utils/dataAccessRequest";
import { renderFormHydrationField } from "@/utils/formHydration";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement.createPage`;

interface PreviewQuestionProps {
    question: QuestionBankQuestion;
    control: Control<QuestionBankQuestionForm>;
}

const PreviewQuestion = ({ question, control }: PreviewQuestionProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const formattedQuestion = question.title && formatDarQuestion(question);
    const optionValue = question[question.title];

    return (
        <Paper
            sx={{
                marginTop: "10px",
                marginBottom: "10px",
                padding: 2,
            }}>
            {!formattedQuestion ? (
                <Typography>{t("noPreview")}</Typography>
            ) : (
                <>
                    {renderFormHydrationField(
                        { ...formattedQuestion },
                        control
                    )}

                    {formattedQuestion.options?.map(option =>
                        option.children?.map(child =>
                            child.name && optionValue === option.label
                                ? renderFormHydrationField(
                                      { ...child },
                                      control
                                  )
                                : null
                        )
                    )}
                </>
            )}
        </Paper>
    );
};
export default PreviewQuestion;
