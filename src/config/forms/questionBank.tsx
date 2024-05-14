import * as yup from "yup";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import { inputComponents } from ".";

const defaultValues: Partial<QuestionBankQuestionForm> = {
    section_id: 1,
    title: "",
    guidance: "",
    type: "",
    settings: {
        mandatory: false,
        allow_guidance_override: false,
        force_required: false,
    },
};

const formFields = [
    {
        label: "Section",
        name: "section_id",
        component: inputComponents.Select,
        options: [],
    },
    {
        component: inputComponents.TextField,
        showClearButton: true,
        variant: "outlined",
        name: "title",
        placeholder: "Enter the title of your question",
        label: "Question Title",
    },
    {
        label: "Question Type",
        name: "type",
        component: inputComponents.RadioGroup,
        radios: Object.values(inputComponents).map(value => ({
            label: value,
            value,
        })),
        isRow: true,
        required: true,
    },
    {
        component: inputComponents.TextArea,
        showClearButton: true,
        variant: "outlined",
        name: "guidance",
        placeholder: "Enter the guidance for your question",
        label: "Default Guidance",
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
    section: yup.string().label("Section"),
    title: yup.string().label("Title"),
    guidance: yup.string().label("Guidance"),
    type: yup.string().label("Type"),
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
};
