import { SxProps } from "@mui/material";
import { inputComponents } from ".";

const getSortField = <T>(options: T[], sx: SxProps = { minWidth: 220 }) => ({
    sx,
    component: inputComponents.Select,
    label: "",
    options,
    name: "sortField",
    ariaLabel: "Sort by",
});

const toggleDirection = {
    component: inputComponents.ToggleDirection,
    label: "",
    name: "sortDirection",
};

export { getSortField, toggleDirection };
