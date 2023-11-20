import * as yup from "yup";
import { inputComponents } from ".";

export interface EmailNotification {
    notifications_contact_email: boolean;
    notifications_team_email: boolean;
    profile_email: string;
    contact_point: string;
}

const defaultValues: EmailNotification = {
    notifications_contact_email: true,
    notifications_team_email: false,
    profile_email: "",
    contact_point: "",
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
                label: "My preferred notification email address",
                name: "profile_email",
                component: inputComponents.TextField,
                disabled: true,
                title: "You do not have permission to edit this field",
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
    defaultValues as emailNotificationDefaultValues,
    validationSchema as emailNotificationValidationSchema,
    formSections as emailNotificationFormSections,
};
