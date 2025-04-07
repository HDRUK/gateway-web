import { ReactNode } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
    OutlinedInput,
    Select as MuiSelect,
    MenuItem,
    SxProps,
    ListSubheader,
} from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import FormInputWrapper from "@/components/FormInputWrapper";
import SelectMenuItem from "@/components/SelectMenuItem";

const MAX_LABEL_LENGTH = 100;

type ValueType = string | number;
export interface SelectOptionsType {
    value: ValueType;
    label: string;
    labelComponent?: ReactNode;
    icon?: IconType;
    isHeader?: boolean;
}

export interface SelectProps<TFieldValues extends FieldValues, TName> {
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
    name: TName;
    control: Control<TFieldValues>;
    required?: boolean;
    hasCheckbox?: boolean;
    formControlSx?: SxProps;
    id?: string;
}

const limitLabelLength = (label?: string) => {
    if (!label) {
        return "";
    }

    return label.length > MAX_LABEL_LENGTH
        ? `${label.slice(0, MAX_LABEL_LENGTH)}...`
        : label;
};

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
    return limitLabelLength(
        options?.find(option => option.value === selected)?.label
    );
};

const Select = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    label,
    info = "",
    extraInfo,
    icon,
    horizontalForm,
    options,
    control,
    name,
    hasCheckbox,
    formControlSx,
    required = false,
    multiple = false,
    iconRight = false,
    disabled = false,
    invertListItem = false,
    id,
    ...rest
}: SelectProps<TFieldValues, TName>) => {
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
            required={required}
            formControlSx={formControlSx}>
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
                id={id || name}
                {...fieldProps}
                value={fieldProps.value ?? ""}
                {...rest}>
                {options?.map(option =>
                    option.isHeader ? (
                        <ListSubheader key={option.label}>
                            {option.label}
                        </ListSubheader>
                    ) : (
                        <MenuItem
                            color="secondary"
                            sx={{
                                ...(invertListItem && {
                                    background: theme =>
                                        theme.palette.primary.main,
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
                                label={limitLabelLength(option.label)}
                                labelComponent={option.labelComponent}
                                invertListItem={invertListItem}
                            />
                        </MenuItem>
                    )
                )}
            </MuiSelect>
        </FormInputWrapper>
    );
};

export default Select;
