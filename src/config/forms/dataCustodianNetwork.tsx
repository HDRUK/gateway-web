import * as yup from "yup";
import { DataCustodianNetworkFormValues } from "@/interfaces/DataCustodianNetwork";
import { getChipLabel } from "@/components/Autocomplete/utils";
import { inputComponents } from ".";

const defaultValues: DataCustodianNetworkFormValues = {
    name: "",
    summary: "",
    enabled: true,
    url: "",
    service: "",
    img_url: "",
    team_ids: [],
};

const validationSchema = yup.object({
    name: yup.string().required().label("Network name"),
    summary: yup.string().required().label("Summary"),
    enabled: yup.boolean().required(),
    url: yup.string().defined().label("Website URL"),
    service: yup.string().defined().label("Service URL(s)"),
    img_url: yup.string().defined().label("Logo URL"),
    team_ids: yup
        .array()
        .required()
        .min(1, "At least one member team is required")
        .of(yup.number().required())
        .label("Member teams"),
});

const enabledField = {
    name: "enabled",
    component: inputComponents.SwitchInline,
};

const teamIdsField = {
    label: "Member teams",
    required: true,
    name: "team_ids",
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
    info: "Type more than 3 characters to search for a team by name.",
    noOptionsText: "Try searching for a team by name...",
};

const formFields = [
    {
        label: "Network name",
        name: "name",
        component: inputComponents.TextField,
        required: true,
    },
    {
        label: "Summary",
        name: "summary",
        info: "Plain text or markdown description shown on the network's public page.",
        component: inputComponents.TextArea,
        required: true,
        rows: 6,
    },
    {
        label: "Website URL",
        name: "url",
        info: "Provide a valid URL to the network's own website.",
        component: inputComponents.TextField,
    },
    {
        label: "Service URL(s)",
        name: "service",
        info: "Provide a valid URL to services offered. Comma-separate multiple URLs.",
        component: inputComponents.TextField,
    },
    {
        label: "Logo URL",
        name: "img_url",
        info: "Provide a valid URL to the network's logo image.",
        component: inputComponents.TextField,
    },
];

export {
    defaultValues as dataCustodianNetworkDefaultValues,
    validationSchema as dataCustodianNetworkValidationSchema,
    formFields as dataCustodianNetworkFormFields,
    enabledField as dataCustodianNetworkEnabledField,
    teamIdsField as dataCustodianNetworkTeamIdsField,
};
