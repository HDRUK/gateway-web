import * as yup from "yup";
import { inputComponents } from ".";

const defaultValues = {
    email: "",
    password: "",
};

const validationSchema = yup
    .object({
        email: yup.string().email().required().label("Email"),
        password: yup.string().required().label("Password"),
    })
    .required();

const formFields = [
    {
        label: "Email",
        name: "email",
        component: inputComponents.TextField,
        type: "email",
        required: true,
    },
    {
        label: "Password",
        name: "password",
        component: inputComponents.TextField,
        type: "password",
        required: true,
    },
];

export {
    defaultValues as signInDefaultValues,
    validationSchema as signInValidationSchema,
    formFields as signInFormFields,
};
