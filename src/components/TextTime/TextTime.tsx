import { MenuItem, Select, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { Control, useController } from "react-hook-form";
import FormInputWrapper from "@/components/FormInputWrapper";

const numberToTwoFigures = (value: number) =>
    value.toString().length === 1 ? `0${value}` : value.toString();

const hourOptions = Array.from({ length: 24 })
    .map((v, index) => index)
    .map(hour => numberToTwoFigures(hour));

const minuteOptions = Array.from({ length: 60 })
    .map((v, index) => index)
    .map(min => numberToTwoFigures(min));

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
        field: { ref, ...fieldProps },
    } = useController({ control, name });

    const [hours, setHours] = useState("01");
    const [mins, setMins] = useState("00");

    //note: this was bugged on dev
    // - need to get the initial values from fieldProps.value
    // - if fieldProps.value is changed from undefined, then set the initial hours
    // warning: this assumes fieldProps.value is the hours
    useEffect(() => {
        if (fieldProps.value !== undefined) {
            setHours(numberToTwoFigures(fieldProps.value));
        }
    }, [fieldProps.value]);

    //control when the user changes hours and mins
    useEffect(() => {
        fieldProps.onChange(customUpdate({ hours, mins }));
    }, [hours, mins]);

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
