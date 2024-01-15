import { Control, Controller, useController } from "react-hook-form";
import { SxProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import FormInputWrapper from "@/components/FormInputWrapper";

export interface DatePickerProps {
    label: string;
    name: string;
    info?: string;
    extraInfo?: string;
    required?: boolean;
    disabled?: boolean;
    horizontalForm?: boolean;
    isRow: boolean;
    control: Control;
    formControlSx?: SxProps;
}

const DatePicker = ({
    label,
    formControlSx,
    control,
    name,
    horizontalForm = false,
    disabled = false,
    info,
    extraInfo,
    required = false,
    ...rest
}: DatePickerProps) => {
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
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="en-gb">
                        <MuiDatePicker
                            format="DD/MM/YYYY"
                            {...field}
                            value={field.value || ""}
                            {...rest}
                        />
                    </LocalizationProvider>
                )}
            />
        </FormInputWrapper>
    );
};

export default DatePicker;
