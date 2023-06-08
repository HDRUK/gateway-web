import * as yup from "yup";

const defaultValues = {
    firstname: "",
    lastname: "",
    email: "",
    sector_id: "",
    provider: "",
    contact_news: false,
    contact_feedback: false,
    organisation: "",
    bio: "",
    domain: "",
    link: "",
    orcid: "",
    terms: false,
};

const validationSchema = yup
    .object({
        firstname: yup.string().required().label("First name"),
        lastname: yup.string().required().label("Last name"),
        email: yup.string().email().required().label("Primary email"),
        sector_id: yup.number().required().label("Sector"),
        bio: yup.string().max(500).label("Bio"),
        terms: yup.boolean().required().oneOf([true]),
        contact_news: yup.boolean(),
        contact_feedback: yup.boolean(),
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

const contactFormFields = [
    {
        title: "Feedback",
        label: "I am happy to be contacted to share and give feedback on my experience with the Gateway",
        name: "contact_feedback",
        component: "checkboxRow",
    },
    {
        title: "News",
        label: "I want to receive news, updates and curated marketing from the Gateway",
        name: "contact_news",
        component: "checkboxRow",
    },
];

export {
    contactFormFields as profileContactFormFields,
    defaultValues as profileDefaultValues,
    validationSchema as profileValidationSchema,
    formFields as profileFormFields,
};
