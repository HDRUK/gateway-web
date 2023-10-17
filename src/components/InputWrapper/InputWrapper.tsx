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
import TextTime from "@/components/TextTime";

type InputType =
    | TextFieldBaseProps
    | SelectProps
    | TextAreaProps
    | CheckboxRowProps
    | CheckboxProps;

interface InputWrapperProps {
    horizontalForm?: boolean;
    component: ComponentTypes;
}

function InputWrapper({ component, ...props }: InputWrapperProps & InputType) {
    const inputs = {
        Autocomplete,
        Switch,
        CheckboxGroup,
        CheckboxRow,
        Checkbox,
        TextField,
        TextTime,
        Select,
        RadioGroup,
        TextArea,
    };

    const Component = inputs[component as ComponentTypes] as ElementType;

    if (!Component) {
        throw Error(`${component} is not a valid input component`);
    }

    return <Component {...props} />;
}

export default InputWrapper;
