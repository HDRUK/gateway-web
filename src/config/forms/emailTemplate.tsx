import * as yup from "yup";
import { EmailTemplateFormValues } from "@/interfaces/EmailTemplate";
import { inputComponents } from ".";

const defaultValues: EmailTemplateFormValues = {
    identifier: "",
    subject: "",
    body: "",
    enabled: true,
};

const validationSchema = yup.object({
    identifier: yup.string().required().label("Identifier"),
    subject: yup.string().required().label("Subject"),
    body: yup.string().required().label("Body"),
    enabled: yup.boolean().required(),
});

const enabledField = {
    name: "enabled",
    component: inputComponents.SwitchInline,
};

const formFields = (isEditing: boolean) => [
    {
        label: "Identifier",
        name: "identifier",
        component: inputComponents.TextField,
        required: true,
        disabled: isEditing,
        info: isEditing
            ? "The identifier can't be changed once created — it's the key the API uses to look up this template when sending email."
            : "A unique key, e.g. dar.status.researcher. This is the key the API uses to look up this template when sending email.",
    },
    {
        label: "Subject",
        name: "subject",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Body",
        name: "body",
        info: "Raw MJML/HTML source. Use [[PLACEHOLDER]] tokens for variables substituted at send time.",
        component: inputComponents.TextArea,
        required: true,
        rows: 14,
    },
];

export {
    defaultValues as emailTemplateDefaultValues,
    validationSchema as emailTemplateValidationSchema,
    formFields as emailTemplateFormFields,
    enabledField as emailTemplateEnabledField,
};
