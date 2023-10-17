import Radio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";
import { FormControlLabel, SxProps } from "@mui/material";
import { Control, Controller, useController } from "react-hook-form";
import FormInputWrapper from "../FormInputWrapper";

export interface RadioGroupProps {
    label: string;
    name: string;
    info?: string;
    required?: boolean;
    disabled?: boolean;
    horizontalForm?: boolean;
    isRow: boolean;
    radios: { value: string; label: string }[];
    control: Control;
    radioSx?: SxProps;
    formControlSx?: SxProps;
}

const RadioGroup = ({
    label,
    formControlSx,
    radioSx = {},
    radios,
    control,
    name,
    horizontalForm = false,
    disabled = false,
    info,
    required = false,
    isRow = false,
}: RadioGroupProps) => {
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
            error={error}
            disabled={disabled}
            required={required}
            formControlSx={formControlSx}>
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <MuiRadioGroup row={isRow} {...field}>
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
