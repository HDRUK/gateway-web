import * as yup from "yup";
import { REGEX_PHONE } from "@/consts/regex";
import { inputComponents } from ".";

const defaultValues = {
    name: "",
    organisation: "",
    contact_number: "",
    query: "",
};

const validationSchema = yup
    .object({
        contact_number: yup
            .string()
            .trim()
            .transform(value => (value === "" ? null : value))
            .nullable()
            .matches(REGEX_PHONE, "Contact number is not valid")
            .label("Contact number"),
        query: yup.string().trim().required().max(1500).label("Your enquiry"),
        organisation: yup
            .string()
            .trim()
            .required("Applicant organisation is a required field"),
        from: yup.string().required("Please select an option"),
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
        name: "from",
        component: inputComponents.Select,
        required: true,
        readOnly: false,
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
