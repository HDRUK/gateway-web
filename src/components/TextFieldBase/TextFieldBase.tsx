import { Control, FieldValues, Path, useController } from "react-hook-form";
import { SerializedStyles } from "@emotion/react";
import {
    InputAdornment,
    OutlinedInput,
    IconButton,
    SxProps,
} from "@mui/material";
import { IconType } from "@/interfaces/Ui";
import FormInputWrapper from "@/components/FormInputWrapper";
import { CancelIcon } from "@/consts/icons";

export interface TextFieldBaseProps<TFieldValues extends FieldValues, TName> {
    label: string;
    placeholder?: string;
    info?: string;
    extraInfo?: string;
    icon?: IconType;
    setValue?: (name: keyof TFieldValues, value: unknown) => void;
    name: TName;
    multiline?: boolean;
    horizontalForm?: boolean;
    rows?: number;
    limit?: number;
    disabled?: boolean;
    fullWidth?: boolean;
    showClearButton?: boolean;
    control: Control<TFieldValues>;
    required?: boolean;
    formControlSx?: SxProps;
    css?: SerializedStyles;
}

const TextFieldBase = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>(
    props: TextFieldBaseProps<TFieldValues, TName>
) => {
    const {
        horizontalForm = false,
        label,
        fullWidth = true,
        disabled = false,
        placeholder,
        info,
        extraInfo,
        icon,
        required = false,
        limit,
        rows,
        multiline = false,
        control,
        name,
        setValue,
        showClearButton = false,
        formControlSx,
        ...inputProps
    } = props;

    const Icon = icon;
    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    if (showClearButton && setValue === undefined) {
        throw Error(
            "You must pass `setValue` if you would like to show the clear button"
        );
    }

    return (
        <FormInputWrapper
            label={label}
            name={name}
            horizontalForm={horizontalForm}
            info={info}
            extraInfo={extraInfo}
            limit={limit}
            error={error}
            value={fieldProps.value}
            disabled={disabled}
            required={required}
            formControlSx={formControlSx}>
            <OutlinedInput
                aria-describedby={info ? `${name}-information` : undefined}
                fullWidth={fullWidth}
                size="small"
                disabled={disabled}
                multiline={multiline}
                rows={rows}
                sx={{ fontSize: 14 }}
                placeholder={placeholder}
                {...(icon &&
                    Icon && {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon fontSize="small" color="primary" />
                            </InputAdornment>
                        ),
                    })}
                {...(showClearButton && {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                disableRipple
                                aria-label="clear text"
                                onClick={() => {
                                    if (typeof setValue === "function") {
                                        setValue(fieldProps.name, "");
                                    }
                                }}
                                edge="end">
                                <CancelIcon color="disabled" fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                })}
                inputRef={ref}
                error={!!error}
                {...fieldProps}
                value={fieldProps.value ?? ""}
                {...inputProps}
            />
        </FormInputWrapper>
    );
};

export default TextFieldBase;
