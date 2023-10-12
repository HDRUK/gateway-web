import { REGEX_ALPHA_NUMERIC_ONLY } from "@/consts/regex";
import * as yup from "yup";
import { Application } from "@/interfaces/Application";
import { inputComponents } from ".";

const defaultValues: Partial<Application> = {
    name: "",
    image_link: "",
    description: "",
    enabled: false,
    permissions: [],
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
