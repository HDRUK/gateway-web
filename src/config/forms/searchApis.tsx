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
        label: "Search Apps",
        createLabel: "Add search for ",
        selectOnFocus: true,
        clearOnBlur: true,
        handleHomeEndKeys: true,
        freeSolo: true,
        multiple: true,
        canCreate: true,
        options: [],
        getOptionLabel: (
            option: string | { label: string; value: unknown }
        ) => {
            if (typeof option === "string") return option;
            return option?.label;
        },
        component: inputComponents.Autocomplete,
    },
    {
        label: "App status:",
        name: "status",
        component: inputComponents.CheckboxGroup,
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
