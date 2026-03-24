import React from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { InputAdornment, OutlinedInput, SxProps } from "@mui/material";
import Box from "@/components/Box";
import FormInputWrapper from "@/components/FormInputWrapper";

export interface HexColourFieldProps<TFieldValues extends FieldValues, TName> {
    label: string;
    info?: string;
    name: TName;
    control: Control<TFieldValues>;
    required?: boolean;
    disabled?: boolean;
    sx?: SxProps;
    fullWidth?: boolean;
    formControlSx?: SxProps;
}

const HexColourField = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    label,
    info,
    name,
    control,
    required = false,
    disabled = false,
    fullWidth = false,
    formControlSx,
    ...rest
}: HexColourFieldProps<TFieldValues, TName>) => {
    const {
        field: { ref, onChange, ...fieldProps },
        fieldState: { error },
    } = useController({ name, control });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (!val.startsWith("#")) {
            val = "#" + val.replace(/[^0-9A-Fa-f]/g, "");
        } else {
            val = "#" + val.slice(1).replace(/[^0-9A-Fa-f]/g, "");
        }
        if (val.length > 7) val = val.slice(0, 7);
        onChange(val);
    };

    const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(fieldProps.value ?? "");

    return (
        <FormInputWrapper
            label={label}
            name={name}
            info={info}
            error={error}
            value={fieldProps.value}
            disabled={disabled}
            required={required}
            formControlSx={formControlSx}>
            <OutlinedInput
                fullWidth={fullWidth}
                size="medium"
                disabled={disabled}
                sx={{ fontSize: 14 }}
                id={name}
                endAdornment={
                    <InputAdornment position="end">
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: 0.5,
                                bgcolor: isValidHex
                                    ? fieldProps.value
                                    : "transparent",
                                border: "1px solid",
                                borderColor: "grey.300",
                                flexShrink: 0,
                            }}
                        />
                    </InputAdornment>
                }
                inputRef={ref}
                error={!!error}
                onChange={handleChange}
                {...fieldProps}
                value={fieldProps.value ?? ""}
                {...rest}
            />
        </FormInputWrapper>
    );
};

export default HexColourField;
