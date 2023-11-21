import * as yup from "yup";
import { inputComponents } from ".";

export interface TeamNotifications {
    user_notification_status: boolean;
    team_notification_status: boolean;
    team_emails: string[];
}

export interface EmailNotification {
    user_notification_status: boolean;
    team_notification_status: boolean;
    profile_email: string;
    team_email: string;
}

const defaultValues: EmailNotification = {
    user_notification_status: true,
    team_notification_status: false,
    profile_email: "",
    team_email: "",
};

const validationSchema = yup
    .object({
        team_email: yup
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
                name: "user_notification_status",
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
                name: "team_notification_status",
                label: "Send email notifications to team email address:",
                component: inputComponents.SwitchInline,
                required: true,
            },
            {
                label: "Team email address",
                name: "team_email",
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
