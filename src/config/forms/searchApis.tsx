import { SearchIcon } from "@/consts/icons";
import { inputComponents } from ".";

const defaultValues = {
    searchTitleDescription: "",
};

const formFields = [
    {
        component: inputComponents.TextField,
        showClearButton: true,
        variant: "outlined",
        name: "searchTitleDescription",
        placeholder: "Search titles and descriptions",
        label: "",
        icon: SearchIcon,
    },
];

export {
    defaultValues as searchApiDefaultValues,
    formFields as searchApiFormFields,
};
