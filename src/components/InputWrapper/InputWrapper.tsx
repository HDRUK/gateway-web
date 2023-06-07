import React from "react";
import Select from "../Select";
import { SelectProps } from "../Select/Select";
import TextArea from "../TextArea";
import { TextAreaProps } from "../TextArea/TextArea";
import TextField from "../TextField";
import { TextFieldBaseProps } from "../TextFieldBase/TextFieldBase";

type ComponentTypes = "textField" | "select" | "textArea";
type InputType = TextFieldBaseProps | SelectProps | TextAreaProps;

interface InputWrapperProps {
    component: ComponentTypes;
}

type CombinedProps = InputType & InputWrapperProps;

const InputWrapper = ({ component, ...props }: CombinedProps) => {
    const inputs = {
        textField: TextField,
        select: Select,
        textArea: TextArea,
    };

    const Component = inputs[component as ComponentTypes];

    if (!Component) {
        throw Error(`${component} is not a valid input component`);
    }

    return <Component {...props} />;
};

export default InputWrapper;
