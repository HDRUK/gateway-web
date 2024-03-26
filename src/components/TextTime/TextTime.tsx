import { useMemo } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { MenuItem, Select, Stack } from "@mui/material";
import FormInputWrapper from "@/components/FormInputWrapper";
import { hourOptions, minuteOptions } from "./TextTime.utils";

export interface TextTimeProps<T extends FieldValues> {
    timeZoneLabel?: string;
    name: { minute: Path<T>; hour: Path<T> };
    info?: string;
    extraInfo?: string;
    required?: boolean;
    disabled?: boolean;
    label: string;
    hourProps?: { disabled?: boolean };
    minProps?: { disabled?: boolean };
    horizontalForm: boolean;
    control: Control<T>;
}

const TextTime = <T extends FieldValues>(props: TextTimeProps<T>) => {
    const {
        timeZoneLabel = "UTC",
        control,
        info,
        extraInfo,
        minProps = { disabled: false },
        hourProps = { disabled: false },
        disabled,
        required,
        label,
        name,
        horizontalForm,
    } = props;

    const {
        fieldState: { error: hourError },
        field: hourField,
    } = useController({ control, name: name.hour });
    const {
        fieldState: { error: minutesError },
        field: minuteField,
    } = useController({ control, name: name.minute });

    const combinedError = useMemo(() => {
        return [
            Array.isArray(hourError) ? { ...hourError } : hourError,
            Array.isArray(minutesError) ? { ...minutesError } : minutesError,
        ].filter(e => e !== undefined);
    }, [hourError, minutesError]);

    return (
        <FormInputWrapper
            horizontalForm={horizontalForm}
            label={label}
            info={info}
            error={combinedError}
            extraInfo={extraInfo}
            disabled={disabled}
            required={required}>
            <Stack direction="row" alignItems="center" gap={1}>
                {timeZoneLabel}
                <Select
                    {...hourProps}
                    {...hourField}
                    size="small"
                    name={name.hour}
                    type="number">
                    {hourOptions.map(hour => (
                        <MenuItem key={hour} value={hour}>
                            {hour}
                        </MenuItem>
                    ))}
                </Select>
                :
                <Select
                    {...minProps}
                    {...minuteField}
                    size="small"
                    name={name.minute}
                    type="number">
                    {minuteOptions.map(minute => (
                        <MenuItem key={minute} value={minute}>
                            {minute}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>
        </FormInputWrapper>
    );
};

export default TextTime;
