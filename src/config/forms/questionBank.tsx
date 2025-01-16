import * as yup from "yup";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import { colors } from "@/config/theme";
import { inputComponents } from ".";

const defaultValues: Partial<QuestionBankQuestionForm> = {
    section_id: 1,
    title: "",
    guidance: "",
    component: inputComponents.TextField,
    settings: {
        mandatory: false,
        allow_guidance_override: false,
        required: false,
    },

    options: [
        {
            label: "",
            children: [],
        },
    ],
};

const supportedComponents = [
    inputComponents.TextArea,
    inputComponents.TextField,
    inputComponents.RadioGroup,
    inputComponents.CheckboxGroup,
    inputComponents.SwitchInline,
    inputComponents.DatePicker,
];

const componentsWithOptions = [
    inputComponents.RadioGroup,
    inputComponents.CheckboxGroup,
];

const sectionField = {
    label: "Section",
    name: "section_id",
    component: inputComponents.Select,
    required: true,
    options: [],
};

const formFields = [
    {
        component: inputComponents.TextField,
        showClearButton: true,
        variant: "outlined",
        name: "title",
        placeholder: "Enter the title of your question",
        label: "Question Title",
        required: true,
    },
    {
        label: "Question Type",
        name: "component",
        component: inputComponents.RadioGroup,
        radios: Object.values(supportedComponents).map(value => ({
            label: value,
            value,
        })),
        isRow: true,
        required: true,
    },

    {
        label: "Options",
        name: "options",
        component: inputComponents.SelectMultipleOptions,
        options: [],
        containerSx: {
            p: 2,
            my: 2,
            backgroundColor: colors.purple100,
        },
    },

    {
        component: inputComponents.TextArea,
        showClearButton: true,
        variant: "outlined",
        name: "guidance",
        placeholder: "Enter the guidance for your question",
        label: "Default Guidance",
        required: true,
    },
    {
        label: "Question Settings",
        name: "settings",
        component: inputComponents.CheckboxGroup,
        nColumns: 5,
        formControlSx: { m: 0, p: 0, mb: 0 },
        checkboxes: [
            {
                name: "settings.mandatory",
                label: "Mandatory",
            },
            {
                name: "settings.allow_guidance_override",
                label: "Allow Guidance Override",
            },
            {
                name: "settings.force_required",
                label: "Force Required",
            },
        ],
    },
];

const formFieldsChild = [
    {
        component: inputComponents.TextField,
        showClearButton: true,
        variant: "outlined",
        name: "title",
        placeholder: "Enter the title of your question",
        label: "Question Title",
        required: true,
    },
    {
        label: "Question Type",
        name: "field.component",
        component: inputComponents.RadioGroup,
        radios: Object.values(supportedComponents).map(value => ({
            label: value,
            value,
        })),
        isRow: true,
        required: true,
    },
    {
        label: "Options",
        name: "field.options",
        component: inputComponents.SelectMultipleOptions,
        options: [],
        containerSx: {
            p: 2,
            my: 2,
            backgroundColor: colors.purple100,
        },
    },

    {
        component: inputComponents.TextArea,
        showClearButton: true,
        variant: "outlined",
        name: "guidance",
        placeholder: "Enter the guidance for your question",
        label: "Default Guidance",
        required: true,
    },
    {
        label: "Question Settings",
        name: "settings",
        component: inputComponents.CheckboxGroup,
        nColumns: 5,
        formControlSx: { m: 0, p: 0, mb: 0 },
        checkboxes: [
            {
                name: "settings.mandatory",
                label: "Mandatory",
            },
            {
                name: "settings.allow_guidance_override",
                label: "Allow Guidance Override",
            },
            {
                name: "settings.force_required",
                label: "Force Required",
            },
        ],
    },
];

// const questionSchema = yup.object().shape({
//     title: yup.string().required().label("Title"),
//     guidance: yup.string().required().label("Guidance"),
//     type: yup.string().required().label("Type"),
// });

const settingsSchema = yup.object().shape({
    mandatory: yup.boolean().label("Mandatory"),
    allow_guidance_override: yup.boolean().label("Allow Guidance Override"),
    force_required: yup.boolean().label("Force Required"),
});

const childSchema = yup.object().shape({
    settings: settingsSchema.required().label("Settings"),

    title: yup.string().required().label("Title"),
    guidance: yup.string().required().label("Guidance"),
    component: yup.string().required().label("Type"),

    options: yup.array().of(
        yup.object().shape({
            name: yup.string(),
            label: yup.string(),
        })
    ),
});

const validationSchema = yup.object().shape({
    section_id: yup.string().required().label("Section"),

    title: yup.string().required().label("Title"),
    guidance: yup.string().required().label("Guidance"),
    component: yup.string().required().label("Type"),

    settings: settingsSchema,

    options: yup.array(),
});

export {
    sectionField,
    defaultValues as questionDefaultValues,
    formFields as questionFormFields,
    validationSchema as questionValidationSchema,
    supportedComponents as questionBankSupportedComponents,
    componentsWithOptions,
    formFieldsChild,
};
