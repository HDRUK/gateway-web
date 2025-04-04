import { ChangeEvent } from "react";
import {
    Control,
    Controller,
    FieldValues,
    Path,
    useController,
} from "react-hook-form";
import { FormControlLabel, SxProps } from "@mui/material";
import MuiRadioGroup from "@mui/material/RadioGroup";
import FormInputWrapper from "@/components/FormInputWrapper";
import StyledRadio from "../StyledRadio";

export interface RadioGroupProps<TFieldValues extends FieldValues, TName> {
    label: string;
    name: TName;
    info?: string;
    extraInfo?: string;
    required?: boolean;
    disabled?: boolean;
    horizontalForm?: boolean;
    isRow?: boolean;
    value?: unknown;
    onChange?: (event: ChangeEvent<HTMLInputElement>, value: string) => void;
    radios: { value: string | number; label: string }[];
    control: Control<TFieldValues>;
    radioSx?: SxProps;
    formControlSx?: SxProps;
    id?: string;
}

const RadioGroup = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
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
    id,
    ...rest
}: RadioGroupProps<TFieldValues, TName>) => {
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
                    <MuiRadioGroup
                        row={isRow}
                        id={id || name}
                        {...field}
                        {...rest}>
                        {radios?.map(({ value, label: radioLabel }) => (
                            <FormControlLabel
                                key={value}
                                sx={radioSx}
                                control={<StyledRadio disabled={disabled} />}
                                value={value}
                                label={radioLabel}
                            />
                        ))}
                    </MuiRadioGroup>
                )}
            />
        </FormInputWrapper>
    );
};

export default RadioGroup;
