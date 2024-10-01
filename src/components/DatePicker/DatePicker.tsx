import {
    Control,
    Controller,
    FieldValues,
    Path,
    useController,
} from "react-hook-form";
import { SxProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import FormInputWrapper from "@/components/FormInputWrapper";

export interface DatePickerProps<TFieldValue extends FieldValues, TName> {
    label: string;
    name: TName;
    info?: string;
    extraInfo?: string;
    required?: boolean;
    disabled?: boolean;
    horizontalForm?: boolean;
    isRow?: boolean;
    control: Control<TFieldValue>;
    formControlSx?: SxProps;
}

const DatePicker = <
    TFieldValues extends FieldValues,
    TName extends Path<TFieldValues>
>({
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
}: DatePickerProps<TFieldValues, TName>) => {
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
                            value={dayjs.utc(field.value)}
                            {...rest}
                        />
                    </LocalizationProvider>
                )}
            />
        </FormInputWrapper>
    );
};

export default DatePicker;
