import * as yup from "yup";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import { colors } from "@/config/theme";
import { inputComponents } from ".";

const defaultValues: Partial<QuestionBankQuestionForm> = {
    section_id: 1,
    title: "",
    guidance: "",
    type: inputComponents.TextField,
    settings: {
        mandatory: false,
        allow_guidance_override: false,
        force_required: false,
    },
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

const formFields = [
    {
        label: "Section",
        name: "section_id",
        component: inputComponents.Select,
        required: true,
        options: [],
    },
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
        name: "type",
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
        name: "type_options",
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

const validationSchema = yup.object({
    section_id: yup.string().required().label("Section"),
    title: yup.string().required().label("Title"),
    guidance: yup.string().required().label("Guidance"),
    type: yup.string().required().label("Type"),
    settings: yup.object().shape({
        mandatory: yup.boolean().label("Mandatory"),
        allow_guidance_override: yup.boolean().label("Allow Guidance Override"),
        force_required: yup.boolean().label("Force Required"),
    }),
});

export {
    defaultValues as questionDefaultValues,
    formFields as questionFormFields,
    validationSchema as questionValidationSchema,
    supportedComponents as questionBankSupportedComponents,
    componentsWithOptions,
};
