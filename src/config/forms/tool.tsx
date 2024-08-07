import * as yup from "yup";
import { inputComponents } from ".";

const defaultDatasetValue = [
    {
        link_type: undefined,
        id: undefined,
    },
];

const defaultValues = {
    url: "",
    name: "",
    type_category: "",
    description: "",
    associated_authors: "",
    programming_language: "",
    keywords: [],
    domain: [],
    any_dataset: false,
    dataset: defaultDatasetValue,
    link: "",
    durs: [],
    publications: [],
    tools: [],
    results: "",
};

const validationSchema = yup.object().shape({
    url: yup.string().url().label("Github Link (optional)"),
    name: yup.string().required().label("Name of script, tool or software"),
    type_category: yup.string().required().label("Category"),
    description: yup.string().min(50).max(1500).required().label("Description"),
    results: yup
        .string()
        .min(50)
        .max(1500)
        .required()
        .label("Results / Insights"),
    associated_authors: yup.string().required().label("Authors"),
    programming_language: yup.string().required().label("Programming language"),
    keywords: yup.array().of(yup.string()),
    domain: yup.array().of(yup.string()),
    any_dataset: yup.boolean(),
    dataset: yup.array().of(
        yup.object().shape({
            link_type: yup.string().label("Relationship"),
            id: yup.number().label("Dataset"),
        })
    ),
});

const formArrayFields = [
    {
        label: "Relationship",
        component: inputComponents.Select,
        options: [
            { label: "Used on", value: "USED_ON" },
            { label: "Derived from (Tool)", value: "DERIVED_FROM" },
            { label: "Used in (Tool)", value: "USED_IN" },
            { label: "Created from (Tool)", value: "CREATED_FROM" },
        ],
    },
    {
        label: "Dataset title",
        component: inputComponents.Autocomplete,
        name: "id",
        placeholder: "Type to search dataset titles",
        showClearButton: true,
    },
];

const formFields = [
    {
        label: "Github Link (optional)",
        name: "url",
        info: "Where can we find this analysis script, tool or software?",
        component: inputComponents.TextField,
    },
    {
        label: "Name of script, tool or software",
        name: "name",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Category",
        info: "Select from existing list",
        name: "type_category",
        component: inputComponents.Select,
        required: true,
    },
    {
        label: "Description",
        info: "Include the analysis script, tool or software purpose and objective. Must be at least 50 characters.",
        name: "description",
        component: inputComponents.TextArea,
        required: true,
        min: 50,
        limit: 1500,
    },
    {
        label: "Results / Insights",
        info: "Include any results or insights about the analysis script, tool or software. Must be at least 50 characters.",
        name: "results",
        options: [],
        component: inputComponents.TextArea,
        required: true,
        limit: 1500,
    },
    {
        label: "Authors",
        info: "Please add the names of the people who authored this analysis script, tool or software, using a comma to separate the name",
        name: "associated_authors",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Programming language",
        info: "Programming languages, formalisms or frameworks. E.g. Python, RDF, GATE",
        name: "programming_language",
        component: inputComponents.Select,
        required: true,
    },
    {
        label: "Keywords (optional)",
        info: "Technological paradigms or other keywords, eg. rule-based, clustering, supervised machine learning",
        name: "keywords",
        component: inputComponents.Autocomplete,
        canCreate: true,
        multiple: true,
    },
    {
        label: "DATASET_RELATIONSHIP_COMPONENT",
    },
    {
        label: (
            <span>
                Analysis script, tool or software can be used with any dataset
            </span>
        ),
        name: "any_dataset",
        component: inputComponents.Checkbox,
    },
    {
        label: "Domain (optional)",
        info: "Eg. Biogenomics, Nutrition, Blockchain",
        name: "domain",
        component: inputComponents.Autocomplete,
        canCreate: true,
        multiple: true,
    },
];

export {
    defaultValues as toolDefaultValues,
    validationSchema as toolValidationSchema,
    formFields as toolFormFields,
    formArrayFields as toolFormArrayFields,
    defaultDatasetValue,
};

export interface DatasetRelationship {
    link_type: string | undefined;
    id: number | undefined;
}
