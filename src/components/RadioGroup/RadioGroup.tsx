import { ChangeEvent } from "react";
import {
    Control,
    Controller,
    FieldValues,
    Path,
    useController,
} from "react-hook-form";
import { FormControlLabel, SxProps } from "@mui/material";
import Radio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";
import FormInputWrapper from "@/components/FormInputWrapper";

export interface RadioGroupProps<T extends FieldValues> {
    label: string;
    name: Path<T>;
    info?: string;
    extraInfo?: string;
    required?: boolean;
    disabled?: boolean;
    horizontalForm?: boolean;
    isRow?: boolean;
    value?: unknown;
    onChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
    radios: { value: string; label: string }[];
    control: Control<T>;
    radioSx?: SxProps;
    formControlSx?: SxProps;
}

const RadioGroup = <T extends FieldValues>({
    label,
    formControlSx,
    radioSx = {},
    radios,
    control,
    name,
    horizontalForm = false,
    disabled = false,
    info,
    extraInfo,
    required = false,
    isRow = false,
    ...rest
}: RadioGroupProps<T>) => {
    const {
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return (
        <FormInputWrapper
            label={label}
            horizontalForm={horizontalForm}
            info={info}
            name={name}
            extraInfo={extraInfo}
            error={error}
            disabled={disabled}
            required={required}
            formControlSx={formControlSx}>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <MuiRadioGroup row={isRow} {...field} {...rest}>
                        {radios.map(({ value, label: radioLabel }) => {
                            return (
                                <FormControlLabel
                                    key={value}
                                    sx={radioSx}
                                    control={<Radio disabled={disabled} />}
                                    value={value}
                                    label={radioLabel}
                                />
                            );
                        })}
                    </MuiRadioGroup>
                )}
            />
        </FormInputWrapper>
    );
};

export default RadioGroup;
