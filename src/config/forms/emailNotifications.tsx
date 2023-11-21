import * as yup from "yup";
import { inputComponents } from ".";

export interface TeamNotifications {
    user_notification_status: boolean; //this should define if thie notification is enabled or not
    team_notification_status: boolean; //this should be true if the notification is for a team
    team_emails: string[];
}

export interface EmailNotification {
    notifications_contact_email: boolean;
    notifications_team_email: boolean;
    profile_email: string;
    contact_point: string;
    team_emails: string[];
}

const defaultValues: EmailNotification = {
    notifications_contact_email: true,
    notifications_team_email: false,
    profile_email: "",
    contact_point: "",
    team_emails: [],
};

const validationSchema = yup
    .object({
        team_emails: yup
            .array()
            .of(yup.string().email().nullable())
            .transform(value => {
                if (!value || value.length === 0) {
                    return null;
                }
                return value.filter(email => email !== "");
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
                label: "Team email addresses",
                name: "team_emails",
                canCreate: true,
                selectOnFocus: true,
                clearOnBlur: true,
                handleHomeEndKeys: true,
                multiple: true,
                isOptionEqualToValue: (
                    option: { value: string | number; label: string },
                    value: string | number
                ) => option.value === value,
                /*getChipLabel: (
                    options: { value: string | number; label: string }[],
                    value: string
                ) => {
                    console.log(value);
                    return options.find(option => option.value === value)
                        ?.label;
                },*/
                component: inputComponents.Autocomplete,
                info: "Additional team email addresses to receive notifications",
            },
        ],
    },
];

export {
    defaultValues as emailNotificationDefaultValues,
    validationSchema as emailNotificationValidationSchema,
    formSections as emailNotificationFormSections,
};
