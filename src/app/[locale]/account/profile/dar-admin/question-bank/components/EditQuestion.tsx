"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { Option } from "@/interfaces/Option";
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
import { inputComponents } from "@/config/forms";
import {
    questionFormFields,
    questionDefaultValues,
    questionValidationSchema,
    componentsWithOptions,
} from "@/config/forms/questionBank";
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

    const { control, handleSubmit, setValue, reset, watch } =
        useForm<QuestionBankQuestionForm>({
            defaultValues,
            resolver: yupResolver(questionValidationSchema),
        });

    const [options, setOptions] = useState<Option[]>([
        { label: "", value: "new-option-1" },
    ]);

    const allFields = watch();

    const {
        section_id,
        required,
        allow_guidance_override,
        force_required,
        latest_version,
    } = question ?? {};

    const question_json = JSON.parse(latest_version?.question_json || null)

    const { title, guidance, field } = question_json ?? {};

    useEffect(() => {
        if (!field) return;
        const options = field?.checkboxes || field?.radios;
        if (options) {
            setOptions(options);
        }
    }, [field]);

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
    }, [reset, question, sectionData]);

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
                name: formData.title,
                description: formData.guidance,
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
            default: 1, // TODO set this from form? What does this field even do?
            // locked: 0, - consider functionality for unlocking here?
        };
        onSubmit(payload);
    };

    const hydratedFormFields = useMemo(
        () =>
            questionFormFields
                .map(field => {
                    if (field.name === "type_options") {
                        const { type } = allFields;
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
                .filter(field => field !== undefined),
        [sectionData, options, allFields]
    );

    const currentFormHydration = useMemo(
        () => ({
            ...question,
            title: allFields.title || "",
            field: {
                ...field,
                name: "",
                guidance: allFields.guidance || "",
                component: inputComponents[allFields.type],
                ...(allFields.type === inputComponents.RadioGroup && {
                    radios: options.filter(o => o.label),
                }),
                ...(allFields.type === inputComponents.CheckboxGroup && {
                    checkboxes: options.filter(o => o.label),
                }),
            },
        }),
        [allFields, options, question, field]
    );

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
            content: currentFormHydration && (
                <PreviewQuestion
                    question={currentFormHydration}
                    control={control}
                />
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
