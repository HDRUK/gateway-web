import { SearchIcon } from "@/consts/icons";
import { inputComponents } from ".";

const defaultValues = {
    description: [],
    status: {
        enabled: true,
        disabled: true,
    },
};

const formFields = [
    {
        name: "description",
        placeholder: "Search app name or description",
        createLabel: "Add search for ",
        selectOnFocus: true,
        clearOnBlur: true,
        handleHomeEndKeys: true,
        freeSolo: true,
        multiple: true,
        startAdornmentIcon: <SearchIcon color="primary" />,
        canCreate: true,
        component: inputComponents.Autocomplete,
    },
    {
        label: "App status:",
        name: "status",
        component: inputComponents.CheckboxGroup,
        horizontalForm: false,
        nColumns: 10, // makes 10 columns so the two checkboxes are aligned left -- could be improved!
        formControlSx: { m: 0, p: 0, mb: 0 },
        checkboxes: [
            {
                name: "status.enabled",
                label: "Enabled",
            },
            {
                name: "status.disabled",
                label: "Disabled",
            },
        ],
    },
];

export {
    defaultValues as searchApiDefaultValues,
    formFields as searchApiFormFields,
};
