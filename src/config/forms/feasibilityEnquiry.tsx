import * as yup from "yup";
import { colors } from "@/config/theme";
import { REGEX_PHONE } from "@/consts/regex";
import { inputComponents } from ".";

const defaultValues = {
    name: "",
    organisation: "",
    number: "",
    query: "",
    from: "",
};

const validationSchema = yup
    .object({
        number: yup
            .string()
            .transform(value => (value === "" ? null : value))
            .nullable()
            .matches(REGEX_PHONE, "Contact number is not valid")
            .label("Contact number"),
        project_title: yup.string().required().min(2).label("Project title"),
        organisation: yup.string().required("Applicant organisation is a required field"),
        research_aim: yup
            .string()
            .required()
            .max(1500)
            .label("Research aim or question"),
        other_datasets: yup.string().required("Please select an option"),
        dataset_parts_known: yup.string().required("Please select an option"),
        funding: yup.string().required().max(1500).label("Funding"),
        from: yup.string().required("Please select an option"),
        potential_research_benefit: yup
            .string()
            .required()
            .max(1500)
            .label("Potential research benefits"),
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
        label: "Project title",
        name: "project_title",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Research aim or question",
        name: "research_aim",
        component: inputComponents.TextArea,
        required: true,
        info: "Please briefly explain the purpose of your research, why you require this dataset and when you intend to begin the project.",
        limit: 1500,
    },
    {
        label: "Datasets",
        name: "datasets",
        component: inputComponents.Autocomplete,
        freeSolo: true,
        multiple: true,
        readOnly: true,
        required: true,
        style: { backgroundColor: colors.grey },
    },
    {
        label: "Are there other datasets you would like to link with the ones listed above?",
        name: "other_datasets",
        component: inputComponents.RadioGroup,
        radios: Object.values(["Yes", "No"]).map(value => ({
            label: value,
            value,
        })),
        required: true,
        info: "This information helps the data custodian(s) understand your project requirement but you will not be able to list the datasets on this form.",
    },
    {
        label: "Do you know which parts of the dataset you are interested in?",
        name: "dataset_parts_known",
        component: inputComponents.RadioGroup,
        radios: Object.values(["Yes", "No"]).map(value => ({
            label: value,
            value,
        })),
        required: true,
        info: "This information helps the data custodian(s) understand the level of service required but you will not be able to list variables of interest on this form.",
        limit: 1500,
    },
    {
        label: "Funding",
        name: "funding",
        component: inputComponents.TextArea,
        required: true,
        info: "Please provide information on the status of funding for your project, including who is expected to fund the research.",
        limit: 1500,
    },
    {
        label: "Potential research benefits",
        name: "potential_research_benefit",
        component: inputComponents.TextArea,
        required: true,
        info: "Please provide a short explanation of how your research would benefit the health and care system.",
        limit: 1500,
    },
];

export {
    defaultValues as feasibilityEnquiryDefaultValues,
    validationSchema as feasibilityEnquiryValidationSchema,
    formFields as feasibilityEnquiryFormFields,
};
