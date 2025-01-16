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
    id: 2536,
    created_at: "2025-01-16T12:21:34.000000Z",
    updated_at: "2025-01-16T12:21:34.000000Z",
    deleted_at: null,
    question_id: 2537,
    version: 1,
    default: false,
    required: false,
    section_id: 2,
    user_id: 1,
    locked: false,
    archived: false,
    archived_date: null,
    force_required: false,
    allow_guidance_override: true,
    is_child: 0,
    question_type: "STANDARD",
    field: {
        options: ["Yes", "No", "Unsure"],
        component: "RadioGroup",
        validations: [],
    },
    title: "Will your organisation act as data controller?",
    guidance:
        "Please specify if your organisation will act as a data controller. If your organisation is not the sole data controller, please provide details of other data controllers.",
    options: [
        {
            label: "Yes",
            children: [
                {
                    label: "Yes",
                    field: {
                        options: [],
                        component: "TextField",
                        validations: [],
                    },
                    title: "ICO registration number",
                    guidance: "",
                    required: false,
                },
                {
                    label: "Yes",
                    field: {
                        options: [],
                        component: "TextField",
                        validations: [],
                    },
                    title: "Registered address (line 1)",
                    guidance:
                        "Please include the organisation's business address.",
                    required: false,
                },
                {
                    label: "Yes",
                    field: {
                        options: [],
                        component: "TextField",
                        validations: [],
                    },
                    title: "Registered address (line 2)",
                    guidance:
                        "Please include the organisation's business address.",
                    required: false,
                },
                {
                    label: "Yes",
                    field: {
                        options: [],
                        component: "TextField",
                        validations: [],
                    },
                    title: "City",
                    guidance:
                        "Please specify the city where the organisation is located",
                    required: false,
                },
                {
                    label: "Yes",
                    field: {
                        options: [],
                        component: "TextField",
                        validations: [],
                    },
                    title: "Postcode",
                    guidance:
                        "Please include the organisation's business address postcode",
                    required: false,
                },
                {
                    label: "Yes",
                    field: {
                        options: [],
                        component: "TextField",
                        validations: [],
                    },
                    title: "Country",
                    guidance:
                        "Please specify the country where the organisation is located.",
                    required: false,
                },
                {
                    label: "Yes",
                    field: {
                        options: [
                            { label: "yes", value: "yes" },
                            { label: "no", value: "no" },
                        ],
                        component: "CheckboxGroup",
                        validations: [],
                    },
                    title: "Organisation type",
                    guidance: "Please select type of organisation.",
                    required: false,
                },
            ],
        },
        {
            label: "No",
            children: [],
        },
        {
            label: "Unsure",
            children: [],
        },
    ],
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
