import * as yup from "yup";
import { inputComponents } from ".";

const defaultDatasetValue = [
    {
        link_type: undefined,
        id: undefined,
    },
];

const publicationTypeOptions = [
    { label: "Preprint", value: "Preprints" },
    { label: "Research article", value: "Research articles" },
    { label: "Review article", value: "Review articles" },
];

const defaultValues = {
    paper_title: "",
    authors: "",
    publication_type: "Research articles",
    journal_name: "",
    year_of_publication: "",
    abstract: "",
    url: "",
    // keywords: [],
    dataset: defaultDatasetValue,
    tools: [],
};

const validationSchema = yup.object().shape({
    paper_title: yup.string().required().label("Title"),
    authors: yup.string().label("Authors"),
    publication_type: yup.string().required().label("Publication type"),
    journal_name: yup
        .string()
        .min(50)
        .max(1500)
        .required()
        .label("Journal name"),
    year_of_publication: yup
        .string()
        .min(4)
        .max(4)
        .required()
        .label("Publication year"),
    abstract: yup
        .string()
        .min(50)
        .max(1500)
        .required()
        .label("Publication year"),
    url: yup.string().required().nullable().url().label("DOI/Web link"),
    // keywords: yup.array().of(yup.string()),
    dataset: yup.array().of(
        yup.object().shape({
            link_type: yup.string().required().label("Relationship"),
            id: yup.number().required().label("Dataset"),
        })
    ),
});

const formArrayFields = [
    {
        label: "Relationship",
        component: inputComponents.Select,
        options: [
            { label: "About the dataset", value: "ABOUT" },
            { label: "Using the dataset", value: "USING" },
        ],
        required: true,
    },
    {
        label: "Dataset title",
        component: inputComponents.Autocomplete,
        name: "id",
        placeholder: "Type to search dataset titles",
        showClearButton: true,
        required: true,
    },
];

const formFields = [
    {
        label: "Title",
        name: "paper_title",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Authors (optional)",
        info: "Please add the names of the people who authored this paper, using a comma to separate the names",
        name: "authors",
        component: inputComponents.TextField,
    },
    // {
    //     label: <span>This article is a preprint</span>,
    //     name: "preprint",
    //     component: inputComponents.Checkbox,
    // },
    {
        label: "Publication type",
        name: "publication_type",
        options: publicationTypeOptions,
        component: inputComponents.Select,
        required: true,
    },

    {
        label: "Journal name",
        name: "journal_name",
        component: inputComponents.TextField,
        required: true,
        min: 50,
        limit: 1500,
    },
    {
        label: "Publication year",
        name: "year_of_publication",
        component: inputComponents.TextField,
        required: true,
        min: 50,
        limit: 1500,
    },
    {
        label: "Abstract",
        name: "abstract",
        info: "Provide a brief summary of the paper",
        component: inputComponents.TextArea,
        required: true,
        min: 50,
        limit: 1500,
    },
    {
        label: "DOI/Web link",
        name: "url",
        info: "DOI or url for the publication",
        component: inputComponents.TextField,
        required: true,
    },
    // {
    //     label: "Keywords (optional)",
    //     info: "Technological paradigms or other keywords. Eg. Rule-based, clustering, supervised machine learning",
    //     name: "keywords",
    //     component: inputComponents.Autocomplete,
    //     canCreate: true,
    //     multiple: true,
    // },
    {
        label: "DATASET_RELATIONSHIP_COMPONENT",
    },
];

export {
    defaultValues as publicationDefaultValues,
    validationSchema as publicationValidationSchema,
    formFields as publicationFormFields,
    formArrayFields as publicationFormArrayFields,
    defaultDatasetValue,
};

export interface DatasetRelationship {
    link_type: string | undefined;
    id: number | undefined;
}
