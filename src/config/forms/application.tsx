import * as yup from "yup";
import ToggleButton from "@/components/Switch";

const defaultValues = {
    name: "",
    image_link: "",
    tags: [],
    description: "",
    enabled: false,
};

const validationSchema = yup
    .object({
        name: yup.string().required().label("Name"),
        image_link: yup.string().required().label("App Logo"),
        tags: yup.array().label("Tags"),
        description: yup.string().required().label("Description"),
    })
    .required();

const formFields = [
    {
        unCheckedLabel: "Disabled",
        checkedLabel: "Enabled",
        name: "enabled",
        customComponent: ToggleButton,
        required: true,
    },
    {
        label: "Public app name",
        name: "name",
        component: "TextField",
        required: true,
    },
    {
        // Placeholder until component is built
        label: "App logo",
        name: "image_link",
        required: true,
        component: "TextField",
    },
    // {
    //     label: "Add tag",
    //     name: "tags",
    //     component: "TextField",
    //     required: false,
    // },
    {
        label: "Description",
        name: "description",
        component: "TextArea",
        limit: 300,
        required: true,
    },
];

export {
    defaultValues as applicationDefaultValues,
    validationSchema as applicationValidationSchema,
    formFields as applicationFormFields,
};
