import { inputComponents } from ".";

const defaultValues = {
    searchTitleDescription: "",
    status: {
        enabled: false,
        disabled: false,
    },
};

const formFields = [
    {
        component: inputComponents.TextField,
        showClearButton: true,
        variant: "outlined",
        name: "searchTitleDescription",
        placeholder: "Search titles and descriptions",
        label: "",
    },
    {
        label: "Private App status:",
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
