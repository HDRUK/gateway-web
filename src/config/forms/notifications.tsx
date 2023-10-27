import * as yup from "yup";
import { inputComponents } from ".";

const defaultValues = {
    name: "",
};

const validationSchema = yup
    .object({
        name: yup.string().required().label("User"),
        contact_email: yup.string().required().label("Contact email"),
    })
    .required();

const formSections = [
    [
        {
            label: "Send email notifications to:",
            name: "opt_in",
            component: inputComponents.Switch,
            required: true,
        },
        {
            label: "My gateway email",
            name: "contact_email",
            component: inputComponents.TextField,
            required: true,
        },
    ],
    [
        {
            label: "Send email notifications to team email address:",
            name: "opt_in",
            component: inputComponents.Switch,
            required: true,
        },
        {
            label: "Team email address",
            name: "notifications",
            component: inputComponents.TextField,
            required: true,
        },
    ],
];

export {
    defaultValues as notificationDefaultValues,
    validationSchema as notificationValidationSchema,
    formSections as notificationFormSections,
};
