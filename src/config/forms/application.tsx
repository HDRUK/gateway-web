import { REGEX_ALPHA_NUMERIC_ONLY } from "@/consts/regex";
import * as yup from "yup";
import { ApplicationForm } from "@/interfaces/Application";
import { inputComponents } from ".";

const defaultValues: Partial<ApplicationForm> = {
    name: "",
    image_link: "",
    description: "",
    enabled: false,
    permissions: [],
    notifications: [],
};

const validationSchema = yup
    .object({
        name: yup
            .string()
            .matches(
                REGEX_ALPHA_NUMERIC_ONLY,
                "Public API should have alphanumeric characters only"
            )
            .required()
            .label("Public API name"),
        description: yup.string().required().max(300).label("Description"),
        notifications: yup
            .array()
            .min(1, "Notification contacts is a required field")
            .of(yup.string())
            .label("Notification contact(s)"),
    })
    .required();

const formFields = [
    {
        label: "Public API name",
        name: "name",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Description",
        name: "description",
        info: "Please provide a short description of the app you want to create",
        component: inputComponents.TextArea,
        limit: 300,
        required: true,
    },
    {
        label: "Notification Contacts",
        required: true,
        name: "notifications",
        selectOnFocus: true,
        clearOnBlur: true,
        handleHomeEndKeys: true,
        multiple: true,
        isOptionEqualToValue: (
            option: { value: string | number; label: string },
            value: string | number
        ) => option.value === value,
        getChipLabel: (
            options: { value: string | number; label: string }[],
            value: unknown
        ) => options.find(option => option.value === value)?.label,
        component: inputComponents.Autocomplete,
        info: "Email address for people who should receive notifications related to integration. Use ‘tab’ or ‘enter’ to add another email address if adding more than one",
    },
];

const editFormFields = [
    {
        unCheckedLabel: "Disabled",
        checkedLabel: "Enabled",
        name: "enabled",
        component: inputComponents.Switch,
        formControlSx: { alignItems: "center" },
        required: true,
    },
    ...formFields,
];

export {
    defaultValues as applicationDefaultValues,
    validationSchema as applicationValidationSchema,
    editFormFields as applicationEditFormFields,
    formFields as applicationFormFields,
};
