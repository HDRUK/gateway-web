import * as yup from "yup";
import { QuestionBankQuestionForm } from "@/interfaces/QuestionBankQuestion";
import { getChipLabel } from "@/components/Autocomplete/utils";
import { colors } from "@/config/theme";
import { inputComponents } from ".";

const defaultValues: Partial<QuestionBankQuestionForm> = {
    section_id: 2,
    team_ids: [],
    title: "",
    guidance: "",
    component: inputComponents.TextField,
    required: false,
    allow_guidance_override: false,
    force_required: false,
    default: true,
    validations: [],
    options: [],
    all_custodians: true,
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

const custodiansFields = [
    {
        label: "Available to all Custodians",
        name: "all_custodians",
        component: inputComponents.Checkbox,
    },
    {
        label: "Custodian Selection",
        name: "team_ids",
        component: inputComponents.Autocomplete,
        required: true,
        options: [],
        multiple: true,
        isOptionEqualToValue: (
            option: { value: string | number; label: string },
            value: string | number
        ) => option.value === value,
        getChipLabel,
    },
];

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
        component: "FieldArray",
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
                name: "required",
                label: "Mandatory",
            },
            {
                name: "allow_guidance_override",
                label: "Allow Guidance Override",
            },
            {
                name: "force_required",
                label: "Force Required",
            },
        ],
    },
];

const settingsSchema = yup.object().shape({
    required: yup.boolean().required().label("Mandatory"),
    allow_guidance_override: yup
        .boolean()
        .required()
        .label("Allow Guidance Override"),
    force_required: yup.boolean().required().label("Force Required"),
});

const childSchema = yup.array().of(
    yup.object().shape({
        label: yup.string().required().label("Option label"),
        children: yup
            .array()
            .of(
                yup.object().shape({
                    title: yup.string().required().label("Question Title"),
                    guidance: yup.string().required().label("Default Guidance"),
                    component: yup.string().required().label("Question Type"),
                    allow_guidance_override: yup
                        .boolean()
                        .required()
                        .label("Allow Guidance Override"),
                    force_required: yup
                        .boolean()
                        .required()
                        .label("Force Required"),
                    validations: yup.array().required(),
                })
            )
            .test(
                "unique-titles-question",
                "Each question title must be unique",
                value => {
                    if (!value) return true;
                    const titles = value.map(item => item.title);
                    const uniqueTitles = new Set(titles);
                    return uniqueTitles.size === titles.length;
                }
            ),
    })
);

const validationSchema = yup
    .object()
    .shape({
        default: yup.boolean(),
        section_id: yup.string().required().label("Section"),
        team_ids: yup.array().required().label("Custodian Selection"),
        all_custodians: yup.boolean(),
        title: yup.string().required().label("Question Title"),
        guidance: yup.string().required().label("Default Guidance"),
        component: yup.string().required().label("Question Type"),
        options: yup.array().when("component", {
            is: (component: string) => component === "RadioGroup",
            then: () =>
                childSchema.test(
                    "unique-titles",
                    "Each option label must be unique",
                    value => {
                        if (!value) return true;
                        const titles = value.map(item => item.label);
                        const uniqueTitles = new Set(titles);
                        return uniqueTitles.size === titles.length;
                    }
                ),
        }),
        validations: yup.array().required(),
    })
    .concat(settingsSchema);

export {
    sectionField,
    custodiansFields,
    defaultValues as questionDefaultValues,
    formFields as questionFormFields,
    validationSchema as questionValidationSchema,
    supportedComponents as questionBankSupportedComponents,
    componentsWithOptions,
};
