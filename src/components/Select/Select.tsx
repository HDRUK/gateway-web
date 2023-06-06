/** @jsxImportSource @emotion/react */

import {
    FormControl,
    FormHelperText,
    OutlinedInput,
    Select as MuiSelect,
    MenuItem,
} from "@mui/material";

import { useTheme } from "@emotion/react";
import { Control, useController } from "react-hook-form";
import { IconType } from "@/interfaces/Ui";
import Label from "../Label";
import MenuItemContent from "../SelectMenuItem/SelectMenuItem";

type ValueType = string | number;
type OptionsType = { value: ValueType; label: string; icon?: IconType }[];

export interface SelectProps {
    label: string;
    info?: string;
    iconRight?: boolean;
    disabled?: boolean;
    invertListItem?: boolean;
    options: OptionsType;
    multiple?: boolean;
    icon?: IconType;
    name: string;
    control: Control;
    required?: boolean;
}

const renderValue = (
    selected: ValueType | ValueType[],
    options: OptionsType,
    multiple: boolean
) => {
    if (multiple && Array.isArray(selected)) {
        return options
            .filter(option => selected.includes(option.value))
            .map(option => option.label)
            .join(", ");
    }
    return options.find(option => option.value === selected)?.label;
};

const Select = (props: SelectProps) => {
    const {
        label,
        info,
        icon,
        iconRight,
        options,
        control,
        name,
        required,
        multiple,
        disabled,
        invertListItem,
    } = props;

    const theme = useTheme();

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return (
        <FormControl fullWidth sx={{ m: 1 }}>
            <Label
                required={required}
                htmlFor="outlined-adornment-amount"
                label={label}
                sx={{
                    ...(disabled && { color: theme.palette.colors.grey600 }),
                }}
            />
            {info && (
                <FormHelperText
                    sx={{
                        fontSize: 13,
                        color: theme.palette.colors.grey700,
                    }}>
                    {info}
                </FormHelperText>
            )}

            <MuiSelect
                size="small"
                multiple={multiple}
                sx={{ fontSize: 14 }}
                inputRef={ref}
                error={!!error}
                disabled={disabled}
                input={<OutlinedInput />}
                renderValue={selected =>
                    renderValue(selected, options, !!multiple)
                }
                {...fieldProps}>
                {options.map(option => (
                    <MenuItem
                        color="secondary"
                        sx={{
                            ...(invertListItem && {
                                background: theme.palette.primary.main,
                                color: "white",
                            }),
                        }}
                        key={option.value}
                        value={option.value}>
                        <MenuItemContent
                            iconRight={iconRight}
                            icon={icon || option.icon}
                            label={option.label}
                            invertListItem={invertListItem}
                        />
                    </MenuItem>
                ))}
            </MuiSelect>
            {error && (
                <FormHelperText sx={{ fontSize: 14 }} error>
                    {error.message}
                </FormHelperText>
            )}
        </FormControl>
    );
};

Select.defaultProps = {
    info: "",
    icon: undefined,

    required: false,
    multiple: false,
    iconRight: false,
    disabled: false,
    invertListItem: false,
};

export default Select;
