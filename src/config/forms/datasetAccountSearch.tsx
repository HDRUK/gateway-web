import { SearchIcon } from "@/consts/icons";
import { inputComponents } from ".";

const defaultValues = {
    sortField: "updated",
    searchTitle: "",
};

const sortByOptions = [
    {
        label: "Sort By Date of Last Update",
        value: "updated",
        initialDirection: "desc",
    },
    {
        label: "Sort By Date of Creation",
        value: "created",
        initialDirection: "desc",
    },
    {
        label: "Sort By Title",
        value: "metadata.summary.title",
        initialDirection: "asc",
    },
];

const searchFilter = {
    component: inputComponents.TextField,
    showClearButton: true,
    variant: "outlined",
    name: "searchTitle",
    placeholder: "Search analysis script, tools and software titles",
    label: "",
    icon: SearchIcon,
};

const sortField = {
    sx: { minWidth: 220 },
    component: inputComponents.Select,
    label: "",
    options: sortByOptions,
    name: "sortField",
};

const toggleDirection = {
    component: inputComponents.ToggleDirection,
    label: "",
    name: "sortDirection",
};

export {
    toggleDirection,
    sortField,
    searchFilter,
    defaultValues as datasetSearchDefaultValues,
    sortByOptions,
};
