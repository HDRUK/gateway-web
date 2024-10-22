import * as yup from "yup";
import { REGEX_DOI } from "@/consts/regex";
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
    paper_doi: "",
    datasets: defaultDatasetValue,
    tools: [],
    durs: [],
    is_preprint: false,
};

const validationSchema = yup
    .object()
    .shape({
        paper_title: yup.string().required().label("Title"),
        authors: yup.string().required().label("Authors"),
        publication_type: yup.string().required().label("Publication type"),
        journal_name: yup
            .string()
            .min(3)
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
        url: yup.string().nullable().url().label("DOI/Web link"),
        paper_doi: yup
            .string()
            .nullable()
            .test(
                "is-valid-doi",
                "Enter a valid DOI",
                value => !value || REGEX_DOI.test(value)
            )
            .label("DOI"),
        datasets: yup.array().of(
            yup.object().shape({
                link_type: yup.string().required().label("Relationship"),
                id: yup.number().required().label("Dataset"),
            })
        ),
    })
    .test(
        "at-least-one",
        "Either DOI or Web link is required",
        function atLeastOneTest(value) {
            const { url, paper_doi } = value;

            // If both url and paper_doi are empty, trigger error on the url field
            if (!url && !paper_doi) {
                return this.createError({
                    path: "url", // Attach the error to the URL field
                    message: "Either DOI or Web link is required",
                });
            }

            return true;
        }
    );

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
        label: "Authors",
        info: "Please add the names of the people who authored this paper, using a comma to separate the names",
        name: "authors",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: <span>This article is a preprint</span>,
        name: "is_preprint",
        component: inputComponents.Checkbox,
    },
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
        label: "Web link",
        name: "url",
        info: "Url for the publication",
        component: inputComponents.TextField,
    },
    {
        label: "DOI link",
        name: "paper_doi",
        info: "DOI for the publication",
        component: inputComponents.TextField,
    },
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
