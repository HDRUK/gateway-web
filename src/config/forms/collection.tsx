import * as yup from "yup";
import { getChipLabel } from "@/components/Autocomplete/utils";
import { inputComponents } from ".";

const defaultValues = {
    name: "",
    description: "",
    id: "",
    image_link: "",
    keywords: [],
    collaborators: [],
    dur: [],
    publications: [],
    tools: [],
    datasets: [],
};

const validationSchema = yup.object().shape({
    name: yup.string().required().min(2).label("Collection name"),
    keywords: yup.array().of(yup.string()).label("Keywords (optional)"),
    description: yup.string().min(2).max(5000).required().label("Description"),
    collaborators: yup
        .array()
        .of(yup.string())
        .label("Collaborators (optional)"),
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
        component: inputComponents.TextArea,
        rows: 20,
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
        ) => options.find(option => option.value === value)?.label,
    },
    {
        label: "Collaborators (optional)",
        name: "collaborators",
        component: inputComponents.Autocomplete,
        multiple: true,
        canCreate: false,
        isOptionEqualToValue: (
            option: { value: string | number; label: string },
            value: string | number
        ) => option.value === value,
        getChipLabel,
    },
];

export {
    defaultValues as collectionDefaultValues,
    validationSchema as collectionValidationSchema,
    formFields as collectionFormFields,
};
