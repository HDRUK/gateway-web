"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
    QuestionBankQuestion,
    QuestionBankQuestionForm,
    QuestionBankCreateQuestionAdmin,
} from "@/interfaces/QuestionBankQuestion";
import { QuestionBankSection } from "@/interfaces/QuestionBankSection";
import Button from "@/components/Button";
import ErrorDisplay from "@/components/ErrorDisplay";
import Form from "@/components/Form";
import InputWrapper from "@/components/InputWrapper";
import Paper from "@/components/Paper";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import usePut from "@/hooks/usePut";
import apis from "@/config/apis";
import {
    questionFormFields,
    questionDefaultValues,
    questionValidationSchema,
} from "@/config/forms/questionBank";
import { RouteName } from "@/consts/routeName";

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement.updatePage`;

const EditQuestion = ({ questionId }: { questionId: string }) => {
    const t = useTranslations(TRANSLATION_PATH);
    const router = useRouter();

    const [isLocked, setIsLocked] = useState(false);

    const { data, isLoading } = useGet<QuestionBankQuestion>(
        `${apis.questionBankV1Url}/questions/${questionId}`,
        {
            keepPreviousData: false,
        }
    );

    // use patch to lock/unlock the question while editing
    const lockQuestion = usePatch(`${apis.questionBankV1Url}/questions`, {
        subPath: "lock",
        successNotificationsOn: false,
    });
    const unlockQuestion = usePatch(`${apis.questionBankV1Url}/questions`, {
        subPath: "unlock",
        successNotificationsOn: false,
    });

    useEffect(() => {
        if (!isLoading) {
            if (!data?.locked) {
                lockQuestion(questionId, {});
            } else {
                console.log(data);
                setIsLocked(true);
            }
        }
    }, [isLoading]);

    const { data: sectionData } = useGet<QuestionBankSection[]>(
        `${apis.questionBankV1Url}/sections`
    );

    const updateQuestion = usePut<QuestionBankCreateQuestionAdmin>(
        `${apis.questionBankV1Url}/questions/admin`,
        {
            itemName: "Question Bank",
        }
    );

    const section_id = data?.section_id;
    const required = data?.required;
    const allow_guidance_override = data?.allow_guidance_override;
    const force_required = data?.force_required;
    const question = data?.question_json;
    const title = question?.title;
    const guidance = question?.guidance;
    const field = question?.field;

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

    const { control, handleSubmit, setValue, reset } =
        useForm<QuestionBankQuestionForm>({
            defaultValues,
            resolver: yupResolver(questionValidationSchema),
        });

    useEffect(() => {
        const section = sectionData?.filter(s => s.id === section_id)[0];

        const formData = {
            section_id: section?.id || 1,
            title: title || "",
            guidance: guidance || "",
            type: field?.component || "",
            settings: {
                mandatory: !!required,
                allow_guidance_override: !!allow_guidance_override,
                force_required: !!force_required,
            },
        };
        reset(formData);
    }, [reset, data, sectionData]);

    const submitForm = async (formData: QuestionBankQuestionForm) => {
        const payload = {
            required: formData.settings.mandatory ? 1 : 0,
            allow_guidance_override: formData.settings.allow_guidance_override
                ? 1
                : 0,
            force_required: formData.settings.force_required ? 1 : 0,
            field: {
                // this will need updating at a future point
                component: formData.type,
            },
            guidance: formData.guidance,
            title: formData.title,
            section_id: formData.section_id,
            // locked: 0, - consider functionality for unlocking here?
        };

        updateQuestion(questionId, payload).then(() => {
            // consider functionality in BE? question should be unlocked when updated?
            unlockQuestion(questionId, {});
            router.push(
                `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.DAR_ADMIN}/${RouteName.QUESTION_BANK_ADMIN}/${RouteName.LIST}`
            );
        });
    };

    if (isLocked) {
        return <ErrorDisplay variant={423} />;
    }

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
export default EditQuestion;
