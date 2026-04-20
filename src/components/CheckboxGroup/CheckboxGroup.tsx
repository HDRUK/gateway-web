/** @jsxImportSource @emotion/react */
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { SxProps } from "@mui/material";
import { CheckboxProps as MuiCheckboxProps } from "@mui/material/Checkbox";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Checkbox from "@/components/Checkbox";
import CheckboxControlled from "@/components/CheckboxControlled";
import FormInputWrapper from "@/components/FormInputWrapper";

export interface CheckboxGroupProps<TFieldValues extends FieldValues, TName>
    extends Omit<MuiCheckboxProps, "name"> {
    label: string;
    name: TName;
    direction?: "row" | "column";
    nColumns?: number;
    horizontalForm?: boolean;
    info?: string;
    extraInfo?: string;
    limit?: number;
    spacing?: number;
    checkboxes: { value: string; label: string; count?: number }[];
    control: Control<TFieldValues>;
    checkboxSx?: SxProps;
    formControlSx?: SxProps;
    multiple?: boolean;
}

const CheckboxGroup = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
    label,
    name,
    checkboxes,
    direction = "row",
    nColumns,
    horizontalForm = false,
    disabled = false,
    required = false,
    info,
    extraInfo,
    limit,
    control,
    checkboxSx,
    formControlSx,
    multiple = false,
    ...rest
}: CheckboxGroupProps<TFieldValues, TName>) => {
    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    const selectedValues: string[] = Array.isArray(field.value)
        ? (field.value as string[])
        : [];

    const toggleValue = (value: string) => {
        field.onChange(
            selectedValues.includes(value)
                ? selectedValues.filter(v => v !== value)
                : [...selectedValues, value]
        );
    };

    return (
        <FormInputWrapper
            label={label}
            name={name}
            horizontalForm={horizontalForm}
            info={info}
            extraInfo={extraInfo}
            limit={limit}
            error={error}
            value={field.value}
            disabled={disabled}
            required={required}>
            <BoxContainer
                key={name}
                sx={{
                    p: 0,
                    m: 0,
                    gridTemplateColumns:
                        direction === "row"
                            ? `repeat(${nColumns || checkboxes.length}, 1fr)`
                            : null,
                }}>
                {checkboxes.map(checkbox => (
                    <Box key={`${checkbox.label}-wrapper`} sx={{ p: 0, m: 0 }}>
                        {multiple ? (
                            <CheckboxControlled
                                name={checkbox.value}
                                label={checkbox.label}
                                count={checkbox.count}
                                checked={selectedValues.includes(
                                    checkbox.value
                                )}
                                onChange={() => toggleValue(checkbox.value)}
                                onBlur={field.onBlur}
                                key={checkbox.label}
                                sx={checkboxSx}
                                formControlSx={formControlSx}
                                {...rest}
                            />
                        ) : (
                            <Checkbox
                                name={checkbox.value}
                                control={control}
                                key={checkbox.label}
                                sx={checkboxSx}
                                formControlSx={formControlSx}
                                {...rest}
                                {...checkbox}
                            />
                        )}
                    </Box>
                ))}
            </BoxContainer>
        </FormInputWrapper>
    );
};

export default CheckboxGroup;
