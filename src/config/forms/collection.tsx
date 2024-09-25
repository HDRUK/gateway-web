import * as yup from "yup";
import { inputComponents } from ".";

const defaultValues = {
    name: "",
    description: "",
    id: "",
    image_link: "",
    dur: [],
    publications: [],
    tools: [],
    datasets: [],
};

const validationSchema = yup.object().shape({
    name: yup.string().required().min(2).label("Collection name"),
    keywords: yup.array().of(yup.string()).label("Keywords (optional)"),
    description: yup.string().min(2).max(5000).required().label("Description"),
});

const formFields = [
    {
        label: "Collection name",
        name: "name",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Description",
        name: "description",
        info: "Up to 5,000 characters",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Keywords (optional)",
        info: "E.g. NCS; charity; disease",
        name: "keywords",
        component: inputComponents.Autocomplete,
        multiple: true,
        isOptionEqualToValue: (
            option: { value: string | number; label: string },
            value: string | number
        ) => option.value === value,
        getChipLabel: (
            options: { value: string | number; label: string }[],
            value: unknown
        ) => options.find(option => option === value)?.label,
    },
];

export {
    defaultValues as collectionDefaultValues,
    validationSchema as collectionValidationSchema,
    formFields as collectionFormFields,
};
