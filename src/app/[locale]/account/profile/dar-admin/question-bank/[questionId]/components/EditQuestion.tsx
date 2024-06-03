"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Option } from "@/interfaces/Option";
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
import Tabs from "@/components/Tabs";
import useGet from "@/hooks/useGet";
import usePatch from "@/hooks/usePatch";
import apis from "@/config/apis";
import { inputComponents } from "@/config/forms";
import {
    questionFormFields,
    questionDefaultValues,
    questionValidationSchema,
    componentsWithOptions,
} from "@/config/forms/questionBank";
import { RouteName } from "@/consts/routeName";
import { renderFormHydrationField } from "@/utils/formHydration";

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
                setIsLocked(true);
            }
        }
    }, [isLoading]);

    const { data: sectionData } = useGet<QuestionBankSection[]>(
        `${apis.questionBankV1Url}/sections`
    );

    const updateQuestion = usePatch<QuestionBankCreateQuestionAdmin>(
        `${apis.questionBankV1Url}/questions`,
        {
            itemName: "Question Bank",
        }
    );

    const {
        section_id,
        required,
        allow_guidance_override,
        force_required,
        question_json: question,
    } = data ?? {};

    const { title, guidance, field } = question ?? {};

    const defaultValues = useMemo(() => questionDefaultValues, []);

    const { control, handleSubmit, setValue, getValues, reset, watch } =
        useForm<QuestionBankQuestionForm>({
            defaultValues,
            resolver: yupResolver(questionValidationSchema),
        });

    const [options, setOptions] = useState<Option[]>([]);

    const allFields = watch();

    useEffect(() => {
        if (!question?.field) return;
        const options = question?.field?.checkboxes ||
            question?.field?.radios || [{ label: "", value: "new-option-1" }];
        setOptions(options);
    }, [question]);

    const currentFormHydration = useMemo(
        () => ({
            ...question,
            title: allFields.title || "",
            field: {
                ...question?.field,
                component: inputComponents[allFields.type],
                radios:
                    allFields.type === inputComponents.RadioGroup &&
                    options.filter(o => o.label),
                checkboxes:
                    allFields.type === inputComponents.CheckboxGroup &&
                    options.filter(o => o.label),
            },
        }),
        [allFields]
    );

    const getFormFields = () => {
        return questionFormFields
            .map(field => {
                if (field.name === "type_options") {
                    const type = getValues("type");
                    if (!componentsWithOptions.includes(type)) {
                        return undefined;
                    }

                    return {
                        ...field,
                        setOptions,
                        options,
                    };
                }

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
            })
            .filter(field => field !== undefined);
    };

    const hydratedFormFields = useMemo(
        () => getFormFields(),
        [sectionData, data, allFields]
    );

    useEffect(() => {
        const section = sectionData?.filter(s => s.id === section_id)[0];

        const formData = {
            section_id: section?.id || 1,
            title: title || "",
            guidance: guidance || "",
            type: field?.component
                ? inputComponents[field.component]
                : inputComponents.TextField,
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
                ...(formData.type === inputComponents.CheckboxGroup && {
                    checkboxes: options.filter(o => o.label),
                }),
                ...(formData.type === inputComponents.RadioGroup && {
                    radios: options.filter(o => o.label),
                }),
            },
            guidance: formData.guidance,
            title: formData.title,
            section_id: formData.section_id,
            // locked: 0, - consider functionality for unlocking here?
        };

        updateQuestion(questionId, payload).then(res => {
            console.log(payload);
            console.log(questionId);
            console.log(res);
            return;
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
            ),
        },
        {
            label: "Preview",
            value: "preview",
            content: question?.field && (
                <Paper
                    sx={{
                        marginTop: "10px",
                        marginBottom: "10px",
                        padding: 2,
                    }}>
                    <Typography> {currentFormHydration?.title} </Typography>
                    {currentFormHydration?.field &&
                        renderFormHydrationField(
                            currentFormHydration.field,
                            control,
                            "name"
                        )}
                </Paper>
            ),
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
