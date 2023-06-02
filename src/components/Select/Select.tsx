/** @jsxImportSource @emotion/react */

import {
    FormControl,
    FormHelperText,
    OutlinedInput,
    SvgIconTypeMap,
    Select as MuiSelect,
    MenuItem,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import { useTheme } from "@emotion/react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import {
    Control,
    FieldValues,
    UseControllerProps,
    useController,
} from "react-hook-form";
import Label from "../Label";

export interface SelectProps {
    label: string;
    info?: string;
    iconRight?: boolean;
    options: { value: string | number; label: string }[];
    multiple?: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types
    icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
    };
    name: string;
    control: Control;
    rules?: UseControllerProps<FieldValues, string>;
}

interface MenuItemContentProps {
    iconRight: boolean;
    // eslint-disable-next-line @typescript-eslint/ban-types
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
    };
    option: { value: string | number; label: string };
}

const MenuItemContent = ({ iconRight, icon, option }: MenuItemContentProps) => {
    const Icon = icon;

    if (!Icon) return <ListItemText>{option.label}</ListItemText>;

    if (!iconRight) {
        return (
            <>
                <ListItemIcon>
                    <Icon
                        sx={{ marginRight: "0.4rem" }}
                        fontSize="small"
                        color="primary"
                    />
                </ListItemIcon>
                <ListItemText> {option.label}</ListItemText>
            </>
        );
    }

    return (
        <>
            <ListItemText> {option.label}</ListItemText>
            <ListItemIcon sx={{ minWidth: 0 }}>
                <Icon
                    sx={{ marginRight: 0 }}
                    fontSize="xsmall"
                    color="primary"
                />
            </ListItemIcon>
        </>
    );
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
        rules,
        multiple,
    } = props;

    const theme = useTheme();

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
        rules: {
            ...rules,
            required: { value: rules.required, message: "This is required" },
        },
    });

    return (
        <FormControl fullWidth sx={{ m: 1 }}>
            <Label
                required={rules?.required}
                htmlFor="outlined-adornment-amount"
                label={label}
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
                input={<OutlinedInput />}
                {...fieldProps}>
                {options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        <MenuItemContent
                            iconRight={iconRight}
                            icon={icon}
                            option={option}
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
    rules: {},
    multiple: false,
    iconRight: false,
};

export default Select;
