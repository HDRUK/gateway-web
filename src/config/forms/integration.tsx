import * as yup from "yup";
import { AuthType, IntegrationForm } from "@/interfaces/Integration";
import { getChipLabel } from "@/components/Autocomplete/utils";
import { authTypes, federationTypes } from "@/consts/integrations";
import { requiresSecretKey } from "@/utils/integrations";
import { inputComponents } from ".";

const defaultValues: Partial<IntegrationForm> = {
    federation_type: undefined,
    auth_type: undefined,
    auth_secret_key: undefined,
    endpoint_baseurl: "",
    endpoint_datasets: "",
    endpoint_dataset: "",
    run_time_hour: "01",
    run_time_minute: "00",
    enabled: false,
    tested: false,
    notifications: [],
};

const validationSchema = yup.object({
    federation_type: yup.string().required().label("Integration type"),
    auth_type: yup.string().required().label("Authentication type"),
    endpoint_baseurl: yup.string().url().required().label("Base URL"),
    endpoint_dataset: yup
        .string()
        .required()
        .matches(/\/{id}/, "Dataset endpoint must contain /{id}")
        .label("Dataset endpoint"),
    endpoint_datasets: yup.string().required().label("Datasets endpoint"),
    notifications: yup
        .array()
        .min(1, "Notification contacts is a required field")
        .of(yup.string())
        .label("Notification contact(s)"),
    auth_secret_key: yup.string().when("auth_type", {
        is: (auth_type: AuthType) => requiresSecretKey(auth_type),
        then: () => yup.string().required().label("Auth secret key"),
    }),
});

const formFields = [
    {
        label: "Integration Type",
        name: "federation_type",
        info: "The scope of integration. This is locked once the configuration is saved",
        component: inputComponents.Select,
        options: [{ label: "Datasets", value: federationTypes.DATASETS }],
        required: true,
    },
    {
        label: "Authentication Type",
        name: "auth_type",
        info: "The authentication system to enable access to the endpoint specified below",
        component: inputComponents.Select,
        options: [
            { label: "API Key", value: authTypes.API_KEY },
            { label: "Bearer", value: authTypes.BEARER },
            { label: "NO_Auth", value: authTypes.NO_AUTH },
        ],
        required: true,
    },
    {
        label: "Synchronisation Time",
        name: { minute: "run_time_minute", hour: "run_time_hour" },
        info: "Set the hour the synchronisations will take place daily, in 24-hr format",
        component: inputComponents.TextTime,
    },
    {
        label: "Base URL",
        name: "endpoint_baseurl",
        info: "Web address where your content is stored",
        placeholder: "https://server.com/datasets/",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Datasets Endpoint",
        name: "endpoint_datasets",
        component: inputComponents.TextField,
        placeholder: "e.g. datasets/",
        info: "Additional web address suffix which specifies additional parameters for the call to the Base URL",
        required: true,
    },
    {
        label: "Dataset Endpoint",
        name: "endpoint_dataset",
        info: "Additional web address suffix which specifies additional parameters for the call to the datasets Endpoint. Include query parameters after {PID} if necessary.",
        extraInfo:
            "The URL should follow our standard and be made up of: dataset/{id}?queryString - eg: dataset/{id}?assigned=true. The `{id}` is a required placeholder, and should always be present. You can add as many query string parameters as needed, separated by '&'",
        component: inputComponents.TextField,
        placeholder: "mydataset/{id}?assigned=true",
        required: true,
    },
    {
        label: "Authorisation Token",
        name: "auth_secret_key",
        required: true,
        info: "An alphanumeric string that allows access to your API",
        component: inputComponents.TextField,
    },
    {
        label: "Notification Contacts",
        required: true,
        name: "notifications",
        selectOnFocus: true,
        clearOnBlur: true,
        handleHomeEndKeys: true,
        multiple: true,
        isOptionEqualToValue: (
            option: { value: string | number; label: string },
            value: string | number
        ) => option.value === value,
        getChipLabel,
        component: inputComponents.Autocomplete,
        info: "Email address for people who should receive notifications related to integration. Use ‘tab’ or ‘enter’ to add another email address if adding more than one",
    },
];

const editFormFields = [...formFields].map(field => {
    if (field.name === "federation_type") {
        return { ...field, disabled: true };
    }
    return field;
});

export {
    defaultValues as integrationDefaultValues,
    validationSchema as integrationValidationSchema,
    editFormFields as integrationEditFormFields,
    formFields as integrationFormFields,
};
