/** @jsxImportSource @emotion/react */
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { SxProps } from "@mui/material";
import { CheckboxProps as MuiCheckboxProps } from "@mui/material/Checkbox";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import Checkbox from "@/components/Checkbox";
import FormInputWrapper from "@/components/FormInputWrapper";

export interface CheckboxGroupProps<T extends FieldValues>
    extends MuiCheckboxProps {
    label: string;
    name: Path<T>;
    direction?: "row" | "column";
    nColumns?: number;
    horizontalForm?: boolean;
    info?: string;
    extraInfo?: string;
    limit?: number;
    spacing?: number;
    checkboxes: { value: string; label: string; count?: number }[];
    control: Control<T>;
    checkboxSx?: SxProps;
    formControlSx?: SxProps;
}

const CheckboxGroup = <T extends FieldValues>({
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
    ...rest
}: CheckboxGroupProps<T>) => {
    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
    });
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
                        <Checkbox
                            name={checkbox.value}
                            control={control}
                            key={checkbox.label}
                            sx={checkboxSx}
                            formControlSx={formControlSx}
                            {...rest}
                            {...checkbox}
                        />
                    </Box>
                ))}
            </BoxContainer>
        </FormInputWrapper>
    );
};

export default CheckboxGroup;
