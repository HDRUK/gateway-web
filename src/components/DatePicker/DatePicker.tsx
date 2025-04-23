import {
    Control,
    Controller,
    FieldValues,
    Path,
    useController,
} from "react-hook-form";
import { SxProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/en-gb";
import FormInputWrapper from "@/components/FormInputWrapper";
import { getDayjs } from "@/utils/date";

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
    onFocus?: () => void;
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
    onFocus,
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
                render={({ field: { onChange, onBlur, value } }) => (
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="en-gb">
                        <MuiDatePicker
                            format="DD/MM/YYYY"
                            value={getDayjs(value)}
                            onChange={date => {
                                onChange(date);
                            }}
                            slotProps={{
                                textField: {
                                    onBlur,
                                    error: !!error,
                                    onFocus: () => onFocus && onFocus(),
                                },
                            }}
                            {...rest}
                        />
                    </LocalizationProvider>
                )}
            />
        </FormInputWrapper>
    );
};
export default DatePicker;
