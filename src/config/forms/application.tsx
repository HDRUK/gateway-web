import * as yup from "yup";

const defaultValues = {
    publicAppName: "",
    tag: "",
    description: "",
};

const validationSchema = yup
    .object({
        publicAppName: yup.string().required().label("Public app name"),
        tag: yup.string().label("Add tag"),
        description: yup.string().required().label("Description"),
    })
    .required();

const formFields = [
    {
        label: "Public app name",
        name: "publicAppName",
        component: "TextField",
        required: true,
    },
    {
        // Placeholder until component is built
        label: "App logo",
        name: "logo",
        component: "TextField",
        required: false,
    },
    {
        label: "Add tag",
        name: "tag",
        component: "TextField",
        required: false,
    },
    {
        label: "Description",
        name: "description",
        component: "TextArea",
        limit: 300,
        required: true,
    }
];

export {
    defaultValues as applicationDefaultValues,
    validationSchema as applicationValidationSchema,
    formFields as applicationFormFields,
};