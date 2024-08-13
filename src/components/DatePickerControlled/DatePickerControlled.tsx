import { SxProps } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
    DatePickerProps,
    DatePicker as MuiDatePicker,
} from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import "dayjs/locale/en-gb";
import FormInputWrapper from "@/components/FormInputWrapper";

export interface DatePickerControlledProps
    extends DatePickerProps<Dayjs | null> {
    label: string;
    name: string;
    info?: string;
    extraInfo?: string;
    required?: boolean;
    disabled?: boolean;
    horizontalForm?: boolean;
    isRow?: boolean;
    formControlSx?: SxProps;
}

const DatePickerControlled = ({
    label,
    formControlSx,
    name,
    horizontalForm = false,
    disabled = false,
    info,
    extraInfo,
    required = false,
    ...rest
}: DatePickerControlledProps) => {
    return (
        <FormInputWrapper
            label={label}
            horizontalForm={horizontalForm}
            info={info}
            name={name}
            extraInfo={extraInfo}
            disabled={disabled}
            required={required}
            formControlSx={formControlSx}>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="en-gb">
                <MuiDatePicker format="DD/MM/YYYY" {...rest} />
            </LocalizationProvider>
        </FormInputWrapper>
    );
};

export default DatePickerControlled;
