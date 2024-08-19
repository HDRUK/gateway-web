import * as yup from "yup";
import { REGEX_ALPHA_ONLY } from "@/consts/regex";
import { inputComponents } from ".";

const defaultValues = {
    name: "",
    organisation: "",
    email: "",
    number: "",
    query: "",
};

const phoneRegex =
    /^(\+?\d{1,4}?[\s.-]?)?(\(?\d{1,4}?\)?[\s.-]?)?[\d\s.-]{5,15}$/;

const validationSchema = yup
    .object({
        number: yup
            .string()
            .transform(value => value === "" ? null : value)
            .nullable()
            .matches(phoneRegex, "Contact number is not valid")
            .label("Contact number"),
        query: yup.string().required().max(1500).label("Your enquiry"),
    })
    .required();

const formFields = [
    {
        label: "Name",
        name: "name",
        component: inputComponents.TextField,
        required: true,
        info: "This is automatically filled from your profile and cannot be changed in this form.",
        readOnly: true,
    },
    {
        label: "Applicant organisation",
        name: "organisation",
        component: inputComponents.TextField,
        required: true,
        info: "This is automatically filled from your profile and cannot be changed in this form.",
        readOnly: true,
    },
    {
        label: "Email",
        name: "email",
        component: inputComponents.TextField,
        required: true,
        info: "This is automatically filled from your profile and cannot be changed in this form.",
        readOnly: true,
    },
    {
        label: "Contact number (optional)",
        name: "contact_number",
        component: inputComponents.TextField,
        required: false,
    },
    {
        label: "Your enquiry",
        name: "query",
        component: inputComponents.TextArea,
        required: true,
        limit: 1500,
    },
];

export {
    defaultValues as generalEnquiryDefaultValues,
    validationSchema as generalEnquiryValidationSchema,
    formFields as generalEnquiryFormFields,
};
