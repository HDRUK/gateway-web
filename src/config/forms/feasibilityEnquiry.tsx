import * as yup from "yup";
import { REGEX_PHONE } from "@/consts/regex";
import { inputComponents } from ".";
import Chip from "@/components/Chip";

const defaultValues = {
    name: "",
    organisation: "",
    email: "",
    number: "",
    query: "",
};

const validationSchema = yup
    .object({
        number: yup
            .string()
            .transform(value => (value === "" ? null : value))
            .nullable()
            .matches(REGEX_PHONE, "Contact number is not valid")
            .label("Contact number"),
        research_aim: yup.string().required().max(1500).label("Research aim or question"),
        project_title: yup.string().required().min(2).label("Project title"),
        funding: yup.string().required().max(1500).label("Funding"),
        potential_research_benefit: yup.string().required().max(1500).label("Potential research benefits"),
        other_datasets: yup.string().required("Please select an option"),
        dataset_parts_known: yup.string().required("Please select an option"),
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
        info: "This is automatically filled from your profile and cannot be changed in this form.",
        readOnly: true,
    },
    {
        label: "Email",
        name: "email",
        component: inputComponents.TextField,
        required: true,
        info: "This is automatically filled from your profile and cannot be changed in this form.",
        readOnly: true,
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
        options: ['Yes', 'No'],
        // getOptionLabel: ((option) => option),
        //     options: { value: string | number; label: string }[],
        //     value: unknown
        // ) => options.find(option => option.value === value)?.label,
        // value: <Chip
        //     size="small"
        //     label={"1"}
        //     color={"error"}
        // />, //TODO: chips
        required: true,
        readOnly: true,
    },
    {
        label: "Are there other datasets you would like to link with the ones listed above?",
        name: "other_datasets",
        component: inputComponents.RadioGroup,
        radios: Object.values(['Yes', 'No']).map(value => ({
            label: value,
            value,
        })),
        required: true,
        info: "This information helps the Data Custodian(s) understand your project requirement but you will not be able to list the datasets on this form.",
    },
    {
        label: "Do you know which parts of the dataset you are interested in?",
        name: "dataset_parts_known",
        component: inputComponents.RadioGroup,
        radios: Object.values(['Yes', 'No']).map(value => ({
            label: value,
            value,
        })),
        required: true,
        info: "This information helps the Data Custodian(s) understand the level of service required but you will not be able to list variables of interest on this form.",
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
