/** @jsxImportSource @emotion/react */

import { OutlinedInput, Select as MuiSelect, MenuItem } from "@mui/material";
import { Control, useController } from "react-hook-form";
import { IconType } from "@/interfaces/Ui";
import SelectMenuItem from "@/components/SelectMenuItem";
import FormInputWrapper from "@/components/FormInputWrapper";
import { ReactNode } from "react";

type ValueType = string | number;
export interface SelectOptionsType {
    value: ValueType;
    label: string;
    labelComponent?: ReactNode;
    icon?: IconType;
}

export interface SelectProps {
    label: string;
    info?: string;
    extraInfo?: string;
    iconRight?: boolean;
    disabled?: boolean;
    invertListItem?: boolean;
    options: SelectOptionsType[];
    multiple?: boolean;
    horizontalForm?: boolean;
    icon?: IconType;
    name: string;
    control: Control;
    required?: boolean;
    hasCheckbox?: boolean;
}

const renderValue = (
    selected: ValueType | ValueType[],
    options: SelectOptionsType[],
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
        extraInfo,
        icon,
        horizontalForm,
        iconRight,
        options,
        control,
        name,
        hasCheckbox,
        required,
        multiple,
        disabled,
        invertListItem,
        ...rest
    } = props;

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return (
        <FormInputWrapper
            name={name}
            label={label}
            horizontalForm={horizontalForm}
            info={info}
            extraInfo={extraInfo}
            error={error}
            disabled={disabled}
            required={required}>
            <MuiSelect
                fullWidth
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
                {...fieldProps}
                value={fieldProps.value ?? ""}
                {...rest}>
                {options.map(option => (
                    <MenuItem
                        color="secondary"
                        sx={{
                            ...(invertListItem && {
                                background: theme => theme.palette.primary.main,
                                color: "white",
                            }),
                        }}
                        key={option.value}
                        value={option.value}>
                        <SelectMenuItem
                            multiple={multiple}
                            itemValue={option.value}
                            value={fieldProps.value}
                            hasCheckbox={hasCheckbox}
                            iconRight={iconRight}
                            icon={icon || option.icon}
                            label={option.label}
                            labelComponent={option.labelComponent}
                            invertListItem={invertListItem}
                        />
                    </MenuItem>
                ))}
            </MuiSelect>
        </FormInputWrapper>
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
