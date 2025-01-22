"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import {
    QuestionBankQuestion,
    QuestionBankQuestionForm,
    QuestionBankCreateUpdateQuestion,
} from "@/interfaces/QuestionBankQuestion";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import {
    componentsWithOptions,
    questionDefaultValues,
    questionValidationSchema,
    sectionField,
} from "@/config/forms/questionBank";
import { colors } from "@/config/theme";
import FormQuestions from "./FormQuestions";
import PreviewQuestion from "./PreviewQuestion";

interface EditQuestionProps {
    onSubmit: (
        payload: QuestionBankCreateUpdateQuestion,
        questionId?: string | number
    ) => Promise<void>;
    question?: QuestionBankQuestion;
}

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement`;

const EditQuestion = ({ onSubmit, question }: EditQuestionProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const defaultValues = useMemo(() => questionDefaultValues, []);

    const { data: sectionData } = useGet<QuestionBankSection[]>(
        `${apis.dataAccessSectionV1Url}`
    );

    const { control, handleSubmit, reset, watch, formState } =
        useForm<QuestionBankQuestionForm>({
            defaultValues,
            resolver: yupResolver(questionValidationSchema),
        });

    const allFields = watch();

    useEffect(() => {
        if (question) {
            reset(question);
        }
    }, [reset, question, sectionData]);

    const submitForm = async (formData: QuestionBankQuestionForm) => {
        onSubmit(formData);
    };

    const tabsList = [
        {
            label: "Edit",
            value: "edit",
            content: (
                <Form onSubmit={handleSubmit(submitForm)}>
                    <Paper
                        sx={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            padding: 2,
                        }}>
                        <InputWrapper
                            key={sectionField.name}
                            control={control}
                            {...sectionField}
                            options={
                                sectionData?.map(section => ({
                                    value: section.id,
                                    label: section.name,
                                })) || []
                            }
                        />
                    </Paper>

                    <Paper
                        sx={{
                            marginTop: "10px",
                            marginBottom: "10px",
                            padding: 2,
                        }}>
                        <FormQuestions
                            control={control}
                            showOptions={componentsWithOptions.includes(
                                allFields.component
                            )}
                            watch={watch}
                        />

                        {typeof formState.errors.options?.message ===
                            "string" && (
                            <Typography sx={{ color: colors.red700 }}>
                                {formState.errors.options?.message}
                            </Typography>
                        )}
                    </Paper>

                    <Paper
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            marginBottom: "10px",
                            padding: 2,
                        }}>
                        <Button type="submit">{t("save")}</Button>
                    </Paper>
                </Form>
            ),
        },
        {
            label: "Preview",
            value: "preview",
            content: <PreviewQuestion question={allFields} control={control} />,
        },
    ];

    return (
        <Tabs
            centered
            tabs={tabsList}
            tabBoxSx={{ padding: 0 }}
            rootBoxSx={{ padding: 0 }}
        />
    );
};
export default EditQuestion;
