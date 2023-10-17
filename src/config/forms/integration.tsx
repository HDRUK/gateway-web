import * as yup from "yup";
import { Integration } from "@/interfaces/Integration";
import { inputComponents } from ".";

const defaultValues: Partial<Integration> = {
    federation_type: undefined,
    auth_type: undefined,
    auth_secret_key: "",
    endpoint_baseurl: "",
    endpoint_datasets: "",
    endpoint_dataset: "",
    run_time_hour: 0,
    enabled: false,
    notification: [],
};

const validationSchema = yup.object({}).required();

const formFields = [
    {
        label: "Integration Type",
        name: "federation_type",
        info: "The scope of integration. This is locked once the configuration is saved.",
        component: inputComponents.Select,
        options: [{ label: "Datasets", value: "d" }],
        required: true,
    },
    {
        label: "Authentication Type",
        name: "auth_type",
        info: "The authentication system to enable access to the endpoint specified below",
        component: inputComponents.Select,
        options: [
            { label: "API Key", value: "API_KEY" },
            { label: "Bearer", value: "BEARER" },
            { label: "NO_Auth", value: "NO_AUTH" },
        ],
        required: true,
    },
    {
        label: "Synchronisation Time",
        name: "run_time_hour",
        component: inputComponents.TextArea,
        limit: 300,
        required: true,
    },
    {
        label: "Base URL",
        name: "endpoint_baseurl",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Datasets Endpoint",
        name: "endpoint_datasets",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Dataset Endpoint",
        name: "endpoint_dataset",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Authorisation Token",
        name: "auth_secret_key",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Notification Contacts",
        name: "",
        component: inputComponents.TextField,
        required: true,
    },
];

const editFormFields = [...formFields];

export {
    defaultValues as integrationDefaultValues,
    validationSchema as integrationValidationSchema,
    editFormFields as integrationEditFormFields,
    formFields as integrationFormFields,
};
