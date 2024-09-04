import { ResourceType } from "@/interfaces/AddResource";
import { inputComponents } from "@/config/forms";
import { SearchIcon } from "@/consts/icons";

export const defaultValues = {
    sortField: "updated",
    searchTitle: "",
};

export const searchResource = {
    label: "",
    component: inputComponents.TextField,
    showClearButton: true,
    variant: "outlined",
    name: "searchTitle",
    placeholder: "Enter the title of the resource",
    icon: SearchIcon,
};

export const resourceTypes = [
    ResourceType.DATASET,
    ResourceType.DATA_USE,
    ResourceType.PUBLICATION,
    ResourceType.TOOL,
];
