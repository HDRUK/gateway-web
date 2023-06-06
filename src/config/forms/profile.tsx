import * as yup from "yup";

export type ProfileFormData = {
    firstName: string;
    lastName: string;
    email: string;
    sector: string;
};

const defaultValues = { firstName: "", lastName: "", email: "", sector: "" };

const validationSchema = yup
    .object({
        firstName: yup.string().required(),
        lastName: yup.string().required(),
        email: yup.string().required(),
        sector: yup.string().required(),
        bio: yup.string().max(500),
    })
    .required();

const formFields = [
    {
        label: "First name",
        name: "firstName",
        component: "textField",
        required: true,
    },
    {
        label: "Last name",
        name: "lastName",
        component: "textField",
        required: true,
    },
    {
        label: "Primary email",
        info: "Please enter your primary email address as this will be used for all contact from Health Data Research no matter how you choose to sign in.",
        name: "email",
        component: "textField",
        required: true,
    },
    {
        label: "Sector",
        info: "Select one of the sectors your work falls under below.",
        name: "sector",
        options: [],
        component: "select",
        required: true,
    },
    {
        label: "Bio",
        info: "Please provide a short description of who you are.",
        name: "bio",
        component: "textArea",
        limit: 500,
    },
    {
        label: "Domain",
        info: "Add any keywords that describe your organisation and role. E.g. clinician, epilepsy.",
        name: "domain",
        component: "textField",
    },
    {
        label: "ORCID",
        name: "orcid",
        component: "textField",
    },
];

export {
    defaultValues as profileDefaultValues,
    validationSchema as profileValidationSchema,
    formFields as profileFormFields,
};
