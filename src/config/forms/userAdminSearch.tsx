import { inputComponents } from ".";

const defaultValues = {
    search: "",
};

const searchFilter = {
    component: inputComponents.TextField,
    variant: "outlined",
    name: "search",
    placeholder: "Search by name or team",
    label: "",
    showClearButton: true,
};

export {
    searchFilter as userAdminSearchFilter,
    defaultValues as userAdminSearchDefaultValues,
};
