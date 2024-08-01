import { ElementType } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { SxProps } from "@mui/material";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import Autocomplete from "@/components/Autocomplete";
import Checkbox from "@/components/Checkbox";
import { CheckboxProps } from "@/components/Checkbox/Checkbox";
import CheckboxGroup from "@/components/CheckboxGroup";
import CheckboxRow from "@/components/CheckboxRow";
import { CheckboxRowProps } from "@/components/CheckboxRow/CheckboxRow";
import DatePicker from "@/components/DatePicker";
import RadioGroup from "@/components/RadioGroup";
import Select from "@/components/Select";
import { SelectProps } from "@/components/Select/Select";
import Switch from "@/components/Switch";
import SwitchInline from "@/components/SwitchInline";
import TextArea from "@/components/TextArea";
import { TextAreaProps } from "@/components/TextArea/TextArea";
import TextField from "@/components/TextField";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";
import TextTime from "@/components/TextTime";
import ToggleDirection from "@/components/ToggleDirection";
import SelectMultipleOptions from "../SelectMultipleOptions";

type InputType<TFieldValues extends FieldValues, TName> =
    | TextFieldBaseProps<TFieldValues, TName>
    | SelectProps<TFieldValues, TName>
    | TextAreaProps<TFieldValues, TName>
    | CheckboxRowProps<TFieldValues, TName>
    | CheckboxProps<TFieldValues, TName>;

export interface InputWrapperProps<TFieldValues extends FieldValues, TName> {
    horizontalForm?: boolean;
    component: ComponentTypes;
    control: Control<TFieldValues>;
    name: TName;
    sx: SxProps;
}

export type InputWrapperCombinedProps<
    TFieldValues extends FieldValues,
    TName
> = InputWrapperProps<TFieldValues, TName> & InputType<TFieldValues, TName>;

function InputWrapper<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    component,
    control,
    sx,
    ...props
}: InputWrapperCombinedProps<TFieldValues, TName>) {
    const inputs = {
        Autocomplete,
        Switch,
        CheckboxGroup,
        CheckboxRow,
        Checkbox,
        TextField,
        TextTime,
        ToggleDirection,
        Select,
        RadioGroup,
        TextArea,
        SwitchInline,
        DatePicker,
        SelectMultipleOptions,
    };

    if (component === "TextTime") {
        const name = props.name as unknown as { minute: string; hour: string };
        if (typeof name !== "object" || !name.minute || !name.hour) {
            throw Error(
                `TextTime component requires 'name' to be object: { minute: string; hour: string }`
            );
        }
    }

    const Component = inputs[component as ComponentTypes] as ElementType;

    if (!Component) {
        throw Error(`${component} is not a valid input component`);
    }

    return <Component control={control} sx={sx} {...props} />;
}

export default InputWrapper;
