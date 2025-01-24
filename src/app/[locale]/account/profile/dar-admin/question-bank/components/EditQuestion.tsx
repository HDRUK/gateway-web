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
import { User } from "@/interfaces/User";
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
    custodiansFields,
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

    const { data: teams = [] } = useGet<User[]>(
        `${apis.teamsV1Url}?per_page=1000&`, //is_question_bank=true`, //TODO check which teams should be available and how to paginate
        {
            shouldFetch: true,
            withPagination: true,
        }
    );

    const { control, handleSubmit, reset, watch, getValues, formState } =
        useForm<QuestionBankQuestionForm>({
            defaultValues,
            resolver: yupResolver(questionValidationSchema),
        });

    const allFields = watch();

    const checkboxValue = watch("all_custodians");
    // console.log("checkboxValue", checkboxValue);
    console.log('formState', formState);
    useEffect(() => {
        if (question) {
            reset(question);
        }
    }, [reset, question, sectionData]);

    console.log(question?.all_custodians);

    const submitForm = async (formData: QuestionBankQuestionForm) => {
        onSubmit(formData);
    };
    console.log('all_custodians', getValues("all_custodians"));
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
                        <InputWrapper
                            key={custodiansFields[0].name}
                            control={control}
                            {...custodiansFields[0]}
                        />
                        <InputWrapper
                            key={custodiansFields[1].name}
                            control={control}
                            {...custodiansFields[1]}
                            options={
                                teams?.list?.map(team => ({
                                    value: team.id,
                                    label: team.name,
                                })) || []
                            }
                            disabled={checkboxValue}
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
