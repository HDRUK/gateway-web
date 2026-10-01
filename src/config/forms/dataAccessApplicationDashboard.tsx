import { inputComponents } from "@/config/forms";
import { getSortField } from "@/config/forms/sortFields";
import { SearchIcon } from "@/consts/icons";

const defaultValues = {
    sortField: "updated_at:desc",
    searchTitle: "",
};

const sortByOptions = [
    {
        label: "Date of last activity",
        value: "updated_at:desc",
    },
    {
        label: "Alphabetically by Title",
        value: "project_title:asc",
    },
];

const sortField = getSortField(sortByOptions, { width: 220 });

const searchFilter = {
    component: inputComponents.TextField,
    showClearButton: true,
    variant: "outlined",
    name: "searchTitle",
    placeholder: "I'm looking for...",
    label: "",
    icon: SearchIcon,
    formControlSx: { mb: 0 },
};

export {
    defaultValues as darDashboardDefaultValues,
    sortField as darDashboardSortField,
    searchFilter as darDashboardSearchFilter,
};
