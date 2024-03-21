import React, { ElementType } from "react";
import { Control, FieldValues } from "react-hook-form";
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

type InputType =
    | TextFieldBaseProps
    | SelectProps
    | TextAreaProps
    | CheckboxRowProps
    | CheckboxProps;

export interface InputWrapperProps {
    horizontalForm?: boolean;
    component: ComponentTypes;
}

export type InputWrapperCombinedProps<T extends FieldValues = FieldValues> =
    InputWrapperProps & InputType & { control: Control<T> };

function InputWrapper<T extends FieldValues>({
    component,
    control,
    ...props
}: InputWrapperCombinedProps<T>) {
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

    return <Component control={control} {...props} />;
}

export default InputWrapper;
