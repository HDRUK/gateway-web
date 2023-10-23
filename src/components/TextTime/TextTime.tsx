import { MenuItem, Select, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Control, useController } from "react-hook-form";
import FormInputWrapper from "@/components/FormInputWrapper";

const hourOptions = Array.from({ length: 24 })
    .map((v, index) => index)
    .map(hour => (hour.toString().length === 1 ? `0${hour}` : hour));

const minuteOptions = Array.from({ length: 60 })
    .map((v, index) => index)
    .map(min => (min.toString().length === 1 ? `0${min}` : min));

export interface TextTimeProps {
    timeZoneLabel?: string;
    customUpdate?: () => null;
    name: string;
    info?: string;
    extraInfo?: string;
    required?: boolean;
    disabled?: boolean;
    label: string;
    hourProps?: { disabled?: boolean };
    minProps?: { disabled?: boolean };
    horizontalForm: boolean;
    control: Control;
}

const defaultCustomUpdate = ({
    hours,
    mins,
}: {
    hours: string;
    mins: string;
}) => `${hours}: ${mins}`;

const TextTime = (props: TextTimeProps) => {
    const [hours, setHours] = useState("01");
    const [mins, setMins] = useState("00");

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
        customUpdate = defaultCustomUpdate,
    } = props;

    const {
        fieldState: { error },
        field,
    } = useController({ control, name });

    /*useEffect(() => {
        field.onChange(customUpdate({ hours, mins }));
    }, [customUpdate, field, hours, mins]);
    */

    return (
        <FormInputWrapper
            horizontalForm={horizontalForm}
            label={label}
            info={info}
            name={name}
            error={error}
            extraInfo={extraInfo}
            disabled={disabled}
            required={required}>
            <Stack direction="row" alignItems="center" gap={1}>
                {timeZoneLabel}
                <Select
                    {...hourProps}
                    value={hours}
                    size="small"
                    onChange={e => setHours(e.target.value)}
                    name="hours"
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
                    value={mins}
                    size="small"
                    onChange={e => setMins(e.target.value)}
                    name="mins"
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
