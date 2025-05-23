import * as yup from "yup";
import { GATEWAY_TERMS_URL } from "@/config/hrefs";
import { REGEX_NAME, REGEX_ORCID } from "@/consts/regex";
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
                REGEX_NAME,
                "First name should have alphabetic characters only"
            )
            .label("First name"),
        lastname: yup
            .string()
            .required()
            .matches(
                REGEX_NAME,
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
            .required("You must select a sector")
            .label("Sector"),
        bio: yup.string().max(500).nullable().label("Bio"),
        orcid: yup
            .string()
            .nullable()
            .matches(REGEX_ORCID, {
                message:
                    "ORCID iD must be of format https://orcid.org/xxxx-xxxx-xxxx-xxxx",
                excludeEmptyString: true,
            })
            .label("ORCID iD"),
        terms: yup
            .boolean()
            .required()
            .oneOf([true], "Accept Terms & Conditions is required"),
        contact_news: yup.boolean(),
        contact_feedback: yup.boolean(),
    })
    .required();

const validationSchemaOpenAthens = validationSchema.concat(
    yup
        .object({
            secondary_email: yup
                .string()
                .required()
                .email()
                .label("Secondary email"),
        })
        .required()
);

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
        info: "This email address will receive service-related & marketing emails (e.g. terms and conditions changes, Gateway newsletter)",
        name: "email",
        component: inputComponents.TextField,
        required: true,
        readOnly: true,
    },
    {
        label: "Secondary email",
        info: "Enter a secondary email address if you want contact from Health Data Research to an alternative address.\n This email address will receive notifications related to actions taken on the Gateway (e.g. responses to enquiries submitted via the Gateway)",
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
            <span>
                I agree to the HDRUK{" "}
                <a target="_blank" href={GATEWAY_TERMS_URL} rel="noreferrer">
                    Terms and Conditions
                </a>
            </span>
        ),
        name: "terms",
        component: inputComponents.Checkbox,
        required: true,
    },
];

const formFieldsOpenAthens = formFields.map(field =>
    field.name === "secondary_email"
        ? {
              label: "Secondary email",
              info: "Enter a secondary email address if you want contact from Health Data Research to an alternative address",
              name: "secondary_email",
              component: inputComponents.TextField,
              required: true,
          }
        : field
);

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
    validationSchemaOpenAthens as profileValidationSchemaOpenAthens,
    formFieldsOpenAthens as profileFormFieldsOpenAthens,
};
