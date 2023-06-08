import * as yup from "yup";

export type ProfileFormData = {
    firstname: string;
    lastname: string;
    email: string;
    sector_id: string;
};

const defaultValues = { firstname: "", lastname: "", email: "", sector_id: "" };

const validationSchema = yup
    .object({
        firstname: yup.string().required().label("First name"),
        lastname: yup.string().required().label("Last name"),
        email: yup.string().email().required().label("Primary email"),
        sector_id: yup.number().required().label("Sector"),
        bio: yup.string().max(500).label("Bio"),
        terms: yup.boolean().required().oneOf([true]),
    })
    .required();

const formFields = [
    {
        label: "First name",
        name: "firstname",
        component: "textField",
        required: true,
    },
    {
        label: "Last name",
        name: "lastname",
        component: "textField",
        required: true,
    },
    {
        label: "Primary email",
        info: "Please enter your primary email address as this will be used for all contact from Health Data Research no matter how you choose to sign in",
        name: "email",
        component: "textField",
        required: true,
    },
    {
        label: "Sector",
        info: "Select one of the sectors your work falls under below",
        name: "sector_id",
        options: [],
        component: "select",
        required: true,
    },
    {
        label: "Organisation",
        info: "Please specify your affiliation or company",
        name: "organisation",
        component: "textField",
    },
    {
        label: "Bio",
        info: "Please provide a short description of who you are",
        name: "bio",
        component: "textArea",
        limit: 500,
    },
    {
        label: "Domain",
        info: "Add any keywords that describe your organisation and role. E.g. clinician, epilepsy",
        name: "domain",
        component: "textField",
    },
    {
        label: "Link",
        info: "Social media, research gate, anywhere that people can go to find out more about you",
        name: "link",
        component: "textField",
    },
    {
        label: "ORCID",
        name: "orcid",
        component: "textField",
    },
    {
        label: "I agree to the HDRUK Terms and Conditions",
        name: "terms",
        component: "checkbox",
        required: true,
    },
];

export {
    defaultValues as profileDefaultValues,
    validationSchema as profileValidationSchema,
    formFields as profileFormFields,
};
