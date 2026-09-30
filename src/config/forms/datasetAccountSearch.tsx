import { SearchIcon } from "@/consts/icons";
import { inputComponents } from ".";
import { getSortField, toggleDirection } from "./sortFields";

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
    placeholder: "Search Analysis Scripts & Software titles",
    label: "",
    icon: SearchIcon,
};

const sortField = getSortField(sortByOptions);

export {
    toggleDirection,
    sortField,
    searchFilter,
    defaultValues as datasetSearchDefaultValues,
    sortByOptions,
};
