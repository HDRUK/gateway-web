import React from "react";
import Select from "../Select";
import { SelectProps } from "../Select/Select";
import TextArea from "../TextArea";
import { TextAreaProps } from "../TextArea/TextArea";
import TextField from "../TextField";
import { TextFieldBaseProps } from "../TextFieldBase/TextFieldBase";
import Checkbox from "../Checkbox";
import { CheckboxProps } from "../Checkbox/Checkbox";
import CheckboxRow from "../CheckboxRow";
import { CheckboxRowProps } from "../CheckboxRow/CheckboxRow";

type ComponentTypes =
    | "CheckboxRow"
    | "Checkbox"
    | "TextField"
    | "Select"
    | "TextArea";

type InputType =
    | TextFieldBaseProps
    | SelectProps
    | TextAreaProps
    | CheckboxRowProps
    | CheckboxProps;

interface InputWrapperProps {
    component: ComponentTypes;
}

type CombinedProps = InputType & InputWrapperProps;

const InputWrapper = ({ component, ...props }: CombinedProps) => {
    if (props.customComponent) {
        const CustomComponent = props.customComponent;
        return <CustomComponent {...props} />;
    }

    const inputs = {
        CheckboxRow,
        Checkbox,
        TextField,
        Select,
        TextArea,
    };

    const Component = inputs[component as ComponentTypes];

    if (!Component) {
        throw Error(`${component} is not a valid input component`);
    }

    return <Component {...props} />;
};

export default InputWrapper;
