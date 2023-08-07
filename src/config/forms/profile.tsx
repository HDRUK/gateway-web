import SocialProviders from "@/modules/profile/SocialProviders";
import * as yup from "yup";
import { inputComponents } from ".";

const defaultValues = {
    firstname: "",
    lastname: "",
    email: "",
    sector_id: 1,
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
        sector_id: yup
            .number()
            .moreThan(1, "You must select a Sector")
            .required()
            .label("Sector"),
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
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Last name",
        name: "lastname",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Primary email",
        info: "Please enter your primary email address as this will be used for all contact from Health Data Research no matter how you choose to sign in",
        name: "email",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Your preferred sign in method",
        customComponent: SocialProviders,
        name: "provider",
    },
    {
        label: "Sector",
        info: "Select one of the sectors your work falls under below",
        name: "sector_id",
        options: [],
        component: inputComponents.Select,
        required: true,
    },
    {
        label: "Organisation",
        info: "Please specify your affiliation or company",
        name: "organisation",
        component: inputComponents.TextField,
    },
    {
        label: "Bio",
        info: "Please provide a short description of who you are",
        name: "bio",
        component: inputComponents.TextArea,
        limit: 500,
    },
    {
        label: "Domain",
        info: "Add any keywords that describe your organisation and role. E.g. clinician, epilepsy",
        name: "domain",
        component: inputComponents.TextField,
    },
    {
        label: "Link",
        info: "Social media, research gate, anywhere that people can go to find out more about you",
        name: "link",
        component: inputComponents.TextField,
    },
    {
        label: "ORCID",
        name: "orcid",
        component: inputComponents.TextField,
    },
    {
        label: "I agree to the HDRUK Terms and Conditions",
        name: "terms",
        component: inputComponents.Checkbox,
        required: true,
    },
];

const contactFormFields = [
    {
        title: "Feedback",
        label: "I am happy to be contacted to share and give feedback on my experience with the Gateway",
        name: "contact_feedback",
        component: inputComponents.CheckboxRow,
    },
    {
        title: "News",
        label: "I want to receive news, updates and curated marketing from the Gateway",
        name: "contact_news",
        component: inputComponents.CheckboxRow,
    },
];

export {
    contactFormFields as profileContactFormFields,
    defaultValues as profileDefaultValues,
    validationSchema as profileValidationSchema,
    formFields as profileFormFields,
};
