import * as yup from "yup";
import { REGEX_ALPHA_ONLY } from "@/consts/regex";
import { inputComponents } from ".";

const defaultValues = {
    name: "",
    organisation: "",
    email: "",
    number: "",
    message: "",
};

const phoneRegex =
    /^(\+?\d{1,4}?[\s.-]?)?(\(?\d{1,4}?\)?[\s.-]?)?[\d\s.-]{5,15}$/;

const validationSchema = yup
    .object({
        name: yup
            .string()
            .required()
            .matches(
                REGEX_ALPHA_ONLY,
                "Name should have alphabetic characters only"
            )
            .min(2)
            .label("Name"),
        organisation: yup
            .string()
            .required()
            .min(2)
            .label("Applicant organisation"),
        email: yup
            .string()
            .email()
            .transform(value => {
                return value === "" ? null : value;
            })
            .label("Email")
            .nullable(),
        number: yup
            .string()
            .transform(value => value === "" ? null : value)
            .nullable()
            .matches(phoneRegex, "Contact number is not valid")
            .label("Contact number"),
        message: yup.string().required().max(1500).label("Your enquiry"),
    })
    .required();

const formFields = [
    {
        label: "Name",
        name: "name",
        component: inputComponents.TextField,
        value: 'my test name',
        required: true,
        info: "This is automatically filled from your profile and cannot be changed in this form.",
        readOnly: true,
    },
    {
        label: "Applicant organisation",
        name: "organisation",
        component: inputComponents.TextField,
        value: 'my test org',
        required: true,
        info: "This is automatically filled from your profile and cannot be changed in this form.",
        readOnly: true,
    },
    {
        label: "Email",
        name: "email",
        component: inputComponents.TextField,
        value: 'my test email',
        required: true,
        info: "This is automatically filled from your profile and cannot be changed in this form.",
        readOnly: true,
    },
    {
        label: "Contact number (optional)",
        name: "number",
        component: inputComponents.TextField,
        required: false,
    },
    {
        label: "Your enquiry",
        name: "message",
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
