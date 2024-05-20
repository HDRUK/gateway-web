"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    QuestionBankQuestionForm,
    QuestionBankCreateQuestionAdmin,
} from "@/interfaces/QuestionBankQuestion";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Button from "@/components/Button";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import useGet from "@/hooks/useGet";
import usePost from "@/hooks/usePost";
import apis from "@/config/apis";
import {
    questionFormFields,
    questionDefaultValues,
    questionValidationSchema,
} from "@/config/forms/questionBank";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement.createPage`;

const CreateQuestion = () => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();

    const { data: sectionData } = useGet<QuestionBankSection[]>(
        `${apis.questionBankV1Url}/sections`
    );

    const createQuestion = usePost<QuestionBankCreateQuestionAdmin>(
        `${apis.questionBankV1Url}/questions`,
        {
            itemName: "Question Bank",
        }
    );

    const hydratedFormFields = useMemo(
        () =>
            questionFormFields.map(field => {
                if (field.name === "section_id") {
                    return {
                        ...field,
                        options:
                            sectionData?.map(section => ({
                                value: section.id,
                                label: section.name,
                            })) || [],
                    };
                }
                return field;
            }),
        [sectionData]
    );

    const defaultValues = useMemo(() => questionDefaultValues, []);

    const { control, handleSubmit, setValue } =
        useForm<QuestionBankQuestionForm>({
            defaultValues,
            resolver: yupResolver(questionValidationSchema),
        });

    const submitForm = async (formData: QuestionBankQuestionForm) => {
        const {
            settings: { mandatory, allow_guidance_override, force_required },
            type,
            guidance,
            title,
            section_id,
        } = formData;

        const payload = {
            required: mandatory ? 1 : 0,
            default: 1, // this will need to be updated in the future
            allow_guidance_override: allow_guidance_override ? 1 : 0,
            force_required: force_required ? 1 : 0,
            question_json: {
                field: {
                    // this will need updating at a future point
                    component: type,
                },
            },
            guidance,
            title,
            section_id,
        };

        createQuestion(payload).then(() => {
            router.push(
                `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}/${RouteName.LIST}`
            );
        });
    };

    return (
        <Form onSubmit={handleSubmit(submitForm)}>
            <Paper
                sx={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    padding: 2,
                }}>
                {hydratedFormFields.map(field => (
                    <InputWrapper
                        key={field.name}
                        control={control}
                        setValue={setValue}
                        {...field}
                    />
                ))}
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
    );
};
export default CreateQuestion;
