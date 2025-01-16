"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
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
import { inputComponents } from "@/config/forms";
import {
    componentsWithOptions,
    questionDefaultValues,
    sectionField,
} from "@/config/forms/questionBank";
import FormQuestions from "./FormQuestions";
import PreviewQuestion from "./PreviewQuestion";

interface EditQuestionProps {
    onSubmit: (
        payload: QuestionBankCreateUpdateQuestion,
        questionId?: string | number
    ) => Promise<void>;
    question?: QuestionBankQuestion;
}
const question = {
    id: 1897,
    created_at: "2025-01-14T10:18:10.000000Z",
    updated_at: "2025-01-14T10:18:10.000000Z",
    deleted_at: null,
    question_id: 1895,
    version: 1,
    default: false,
    required: false,
    options: [
        {
            label: "yes",
            children: [
                {
                    label: "yes",
                    field: {
                        options: [
                            { label: "yes", value: "yes" },
                            { label: "no", value: "no" },
                        ],
                        component: "RadioGroup",
                        validations: [],
                    },
                    title: "Are you sure it is?",
                    guidance: "Second chance to confirm",
                    required: false,
                },
                {
                    label: "yes",
                    field: {
                        component: "TextField",
                        validations: [],
                    },
                    title: "And why do you say that?",
                    guidance: "Please explain",
                    required: false,
                },
            ],
        },
        {
            label: "no",
            children: [
                {
                    label: "no",
                    field: {
                        options: [
                            { label: "yes", value: "yes" },
                            { label: "no", value: "no" },
                        ],
                        component: "RadioGroup",
                        validations: [],
                    },
                    title: "Are you sure it isn&#039;t?",
                    guidance: "Second chance to deny",
                    required: false,
                },
                {
                    label: "no",
                    field: {
                        component: "TextField",
                        validations: [],
                    },
                    title: "And why do you say that?",
                    guidance: "Please explain",
                    required: false,
                },
            ],
        },
    ],
    field: {
        options: ["yes", "no"],
        component: "RadioGroup",
        validations: [],
    },
    title: "Is this a test?",
    guidance: "You tell me",
};

const TRANSLATION_PATH = `pages.account.profile.darAdmin.qbManagement`;

const EditQuestion = ({ onSubmit, questionh }: EditQuestionProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const defaultValues = useMemo(() => questionDefaultValues, []);

    const { data: sectionData } = useGet<QuestionBankSection[]>(
        `${apis.dataAccessSectionV1Url}`
    );

    const { control, handleSubmit, setValue, reset, watch } =
        useForm<QuestionBankQuestionForm>({
            defaultValues,
            // resolver: yupResolver(questionValidationSchema),
        });

    const allFields = watch();

    const {
        section_id,
        required,
        allow_guidance_override,
        force_required,
        title,
        guidance,
        field,
        options,
    } = question ?? {};

    useEffect(() => {
        const section = sectionData?.filter(s => s.id === section_id)[0];

        const formData = {
            section_id: section?.id || 1,
            title: title || "",
            guidance: guidance || "",
            component: field?.component
                ? inputComponents[field.component]
                : inputComponents.TextField,
            settings: {
                mandatory: !!required,
                allow_guidance_override: !!allow_guidance_override,
                force_required: !!force_required,
            },

            options,
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
                // component: formData.type,
                name: formData.title,
                description: formData.guidance,
                // ...(formData.type === inputComponents.CheckboxGroup && {
                //     checkboxes: options.filter(o => o.label),
                // }),
                // ...(formData.type === inputComponents.RadioGroup && {
                //     radios: options.filter(o => o.label),
                // }),
            },
            guidance: formData.guidance,
            title: formData.title,
            section_id: formData.section_id,
            default: 1, // TODO set this from form? What does this field even do?
            // locked: 0, - consider functionality for unlocking here?
        };
        // onSubmit(payload);

        console.log(payload);
    };

    const currentFormHydration = useMemo(
        () => ({
            ...question,
            title: allFields.title || "",
            field: {
                ...field,
                name: "",
                guidance: allFields.guidance || "",
                component:
                    inputComponents[allFields?.type] ||
                    inputComponents.RadioGroup,
            },
        }),
        [allFields, question, field]
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
                        <InputWrapper
                            key={sectionField.name}
                            control={control}
                            setValue={setValue}
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
                            setValue={setValue}
                            showOptions={componentsWithOptions.includes(
                                allFields.component
                            )}
                        />
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
