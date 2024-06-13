import { ReactNode, useMemo } from "react";
import { SvgIconComponent } from "@mui/icons-material";
import { ListItemIcon, ListItemText } from "@mui/material";
import CheckBox from "@mui/material/Checkbox";
import { IconType } from "@/interfaces/Ui";
import { ValueType } from "../Autocomplete/Autocomplete";

interface SelectMenuItemProps {
    iconRight?: boolean;
    hasCheckbox?: boolean;
    icon?: IconType;
    invertListItem?: boolean;
    label: string;
    labelComponent?: ReactNode;
    itemValue: string | number;
    value: ValueType | ValueType[];
    multiple?: boolean;
}

const getIsChecked = (
    multiple: boolean,
    itemValue: string | number,
    value: ValueType | ValueType[]
) => {
    if (!multiple) return itemValue === value;
    return (value as ValueType[]).includes(itemValue);
};

const SelectMenuItem = ({
    iconRight = false,
    icon,
    value,
    multiple = false,
    itemValue,
    label,
    labelComponent,
    hasCheckbox = false,
    invertListItem = false,
}: SelectMenuItemProps) => {
    const Icon = icon as SvgIconComponent;

    const isChecked = useMemo(
        () => getIsChecked(multiple, itemValue, value),
        [multiple, itemValue, value]
    );
    if (!iconRight) {
        return (
            <>
                {icon && (
                    <ListItemIcon>
                        <Icon
                            sx={{
                                marginRight: "0.4rem",
                                ...(invertListItem && { color: "white" }),
                            }}
                            fontSize="small"
                            color="primary"
                        />
                    </ListItemIcon>
                )}
                {hasCheckbox && <CheckBox checked={isChecked} sx={{ mr: 2 }} />}
                <ListItemText> {labelComponent || label}</ListItemText>
            </>
        );
    }

    return (
        <>
            {hasCheckbox && <CheckBox checked={isChecked} sx={{ mr: 2 }} />}
            <ListItemText> {label}</ListItemText>
            {icon && (
                <ListItemIcon sx={{ marginRight: "-20px" }}>
                    <Icon
                        sx={{
                            marginRight: 0,
                            minWidth: 0,
                            ...(invertListItem && { color: "white" }),
                        }}
                        fontSize="small"
                        color="primary"
                    />
                </ListItemIcon>
            )}
        </>
    );
};

export default SelectMenuItem;
