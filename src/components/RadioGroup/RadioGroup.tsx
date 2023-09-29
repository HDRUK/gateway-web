import Radio from "@mui/material/Radio";
import MuiRadioGroup from "@mui/material/RadioGroup";
import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    SxProps,
} from "@mui/material";
import { Control, Controller, useController } from "react-hook-form";
import Label from "@/components/Label";
import FormError from "@/components/FormError";

export interface RadioGroupProps {
    label: string;
    name: string;
    info?: string;
    required?: boolean;
    disabled?: boolean;
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
        <FormControl sx={{ mb: 2, ...formControlSx }}>
            <Label required={required} label={label} />
            {info && (
                <FormHelperText
                    sx={{
                        fontSize: 13,
                    }}>
                    {info}
                </FormHelperText>
            )}
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
            {error && <FormError error={error} />}
        </FormControl>
    );
};

export default RadioGroup;
