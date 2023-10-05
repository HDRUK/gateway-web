import * as yup from "yup";
import { REGEX_ALPHA_ONLY, REGEX_NUMERIC_ONLY } from "@/consts/regex";
import { GATEWAY_TERMS_URL } from "@/config/hrefs";
import { inputComponents } from ".";

const defaultValues = {
    firstname: "",
    lastname: "",
    email: "",
    secondary_email: "",
    preferred_email: "primary",
    sector_id: 1,
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
        firstname: yup
            .string()
            .required()
            .matches(
                REGEX_ALPHA_ONLY,
                "First name should have alphabetic characters only"
            )
            .label("First name"),
        lastname: yup
            .string()
            .required()
            .matches(
                REGEX_ALPHA_ONLY,
                "Last name should have alphabetic characters only"
            )
            .label("Last name"),
        secondary_email: yup
            .string()
            .email()
            .transform(value => {
                return value === "" ? null : value;
            })
            .label("Secondary email")
            .nullable(),
        sector_id: yup
            .number()
            .moreThan(1, "You must select a sector")
            .required()
            .label("Sector"),
        bio: yup.string().max(500).label("Bio"),
        orcid: yup
            .string()
            .matches(REGEX_NUMERIC_ONLY, "ORCID iD must be a number")
            .max(16)
            .transform(value => {
                return value === "" ? null : value;
            })
            .nullable()
            .label("ORCID iD"),
        terms: yup
            .boolean()
            .required()
            .oneOf([true], "Accept Terms & Conditions is required"),
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
        label: "SSO email",
        name: "email",
        component: inputComponents.TextField,
        required: true,
        readOnly: true,
    },
    {
        label: "Secondary email",
        info: "Enter a secondary email address if you want contact from Health Data Research to an alternative address",
        name: "secondary_email",
        component: inputComponents.TextField,
    },
    {
        label: "Notification setting",
        info: "Select your preferred notification email address",
        name: "preferred_email",
        component: inputComponents.RadioGroup,
        radios: [
            { label: "SSO email", value: "primary" },
            { label: "Secondary email", value: "secondary" },
        ],
        required: true,
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
        info: "Add any keywords that describe your organisation and role e.g. clinician, epilepsy",
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
        label: "ORCID iD",
        name: "orcid",
        component: inputComponents.TextField,
    },
    {
        label: (
            <div>
                I agree to the HDRUK{" "}
                <a target="_blank" href={GATEWAY_TERMS_URL} rel="noreferrer">
                    Terms and Conditions
                </a>
            </div>
        ),
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
