import { SortDirection } from "@/consts/sort";
import { inputComponents } from ".";
import { getSortField, toggleDirection } from "./sortFields";

const defaultValues = {
    sortField: "updated_at",
    searchTitle: "",
};

const sortByOptions = [
    {
        label: "Sort By Date of Last Activity",
        value: "updated_at",
        initialDirection: SortDirection.DESC,
    },
    {
        label: "Sort By Date of Creation",
        value: "created_at",
        initialDirection: SortDirection.DESC,
    },
    {
        label: "Sort by Title",
        value: "name",
        initialDirection: SortDirection.ASC,
    },
];

const searchFilter = {
    component: inputComponents.TextField,
    showClearButton: true,
    variant: "outlined",
    name: "searchTitle",
    placeholder: "Search Analysis Scripts & Software titles",
    label: "",
};

const sortField = getSortField(sortByOptions);

export {
    toggleDirection,
    sortField,
    searchFilter,
    defaultValues as searchDefaultValues,
    sortByOptions,
};
