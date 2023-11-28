import React, { ElementType } from "react";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { CheckboxRowProps } from "@/components/CheckboxRow/CheckboxRow";
import Select from "@/components/Select";
import { SelectProps } from "@/components/Select/Select";
import TextArea from "@/components/TextArea";
import { TextAreaProps } from "@/components/TextArea/TextArea";
import TextField from "@/components/TextField";
import { TextFieldBaseProps } from "@/components/TextFieldBase/TextFieldBase";
import Checkbox from "@/components/Checkbox";
import { CheckboxProps } from "@/components/Checkbox/Checkbox";
import CheckboxGroup from "@/components/CheckboxGroup";
import CheckboxRow from "@/components/CheckboxRow";
import RadioGroup from "@/components/RadioGroup";
import Autocomplete from "@/components/Autocomplete";
import Switch from "@/components/Switch";
import SwitchInline from "@/components/SwitchInline";
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

export type InputWrapperCombinedProps = InputWrapperProps & InputType;

function InputWrapper({ component, ...props }: InputWrapperCombinedProps) {
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

    return <Component {...props} />;
}

export default InputWrapper;
