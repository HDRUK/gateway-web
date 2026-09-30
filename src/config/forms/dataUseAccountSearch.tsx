import { inputComponents } from ".";
import { getSortField, toggleDirection } from "./sortFields";

const defaultValues = {
    sortField: "updated_at",
    searchTitle: "",
};

const sortByOptions = [
    {
        label: "Sort By date of latest activity",
        value: "updated_at",
        initialDirection: "desc",
    },
    {
        label: "Sort alphabetically by title",
        value: "project_title",
        initialDirection: "asc",
    },
    {
        label: "Sort by project start date",
        value: "project_start_date",
        initialDirection: "desc",
    },
];

const searchFilter = {
    component: inputComponents.TextField,
    showClearButton: true,
    variant: "outlined",
    name: "searchTitle",
    placeholder: "Search project titles",
    label: "",
};

const sortField = getSortField(sortByOptions);

export {
    toggleDirection,
    sortField,
    searchFilter,
    defaultValues as dataUseSearchDefaultValues,
    sortByOptions,
};
