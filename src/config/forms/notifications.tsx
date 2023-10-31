import * as yup from "yup";
import { inputComponents } from ".";

const defaultValues = {
    notifications_contact_email: true,
    notifications_team_email: false,
    profile_email: "",
    contact_point: null,
};

const validationSchema = yup
    .object({
        contact_point: yup
            .string()
            .email()
            .transform(value => {
                return value === "" ? null : value;
            })
            .label("Team email")
            .nullable(),
    })
    .required();

const formSections = [
    {
        id: 1,
        fields: [
            {
                name: "notifications_contact_email",
                label: "Send email notifications to:",
                extraInfo:
                    "You must have this togggle activated in order to receive team related notifications.",
                component: inputComponents.SwitchInline,
                required: true,
            },
            {
                label: "My gateway email",
                name: "profile_email",
                component: inputComponents.TextField,
                disabled: true,
            },
        ],
    },
    {
        id: 2,
        fields: [
            {
                name: "notifications_team_email",
                label: "Send email notifications to team email address:",
                component: inputComponents.SwitchInline,
                required: true,
            },
            {
                label: "Team email address",
                name: "contact_point",
                component: inputComponents.TextField,
            },
        ],
    },
];

export {
    defaultValues as notificationDefaultValues,
    validationSchema as notificationValidationSchema,
    formSections as notificationFormSections,
};
