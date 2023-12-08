import { SxProps } from "@mui/material";
import { Control, Controller, useController } from "react-hook-form";
import FormInputWrapper from "@/components/FormInputWrapper";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import locale from "dayjs/locale/en-gb";

export interface DatePickerProps {
    label: string;
    name: string;
    useCurrentDate?: boolean;
    useStartDate?: string;
    info?: string;
    extraInfo?: string;
    required?: boolean;
    disabled?: boolean;
    horizontalForm?: boolean;
    isRow: boolean;
    radios: { value: string; label: string }[];
    control: Control;
    radioSx?: SxProps;
    formControlSx?: SxProps;
}

const DatePicker = ({
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
                        adapterLocale={locale}>
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
