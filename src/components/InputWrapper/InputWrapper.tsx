import React, { ElementType } from "react";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
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

type InputType =
    | TextFieldBaseProps
    | SelectProps
    | TextAreaProps
    | CheckboxRowProps
    | CheckboxProps;

interface InputWrapperProps {
    customComponent?: ElementType;
    component: ComponentTypes;
}

type CombinedProps = InputType & InputWrapperProps;

const InputWrapper = ({ component, ...props }: CombinedProps) => {
    const { customComponent, ...rest } = props;
    if (customComponent) {
        const CustomComponent = customComponent;
        return <CustomComponent {...rest} />;
    }

    const inputs = {
        CheckboxRow,
        Checkbox,
        TextField,
        Select,
        TextArea,
    };

    const Component = inputs[component as ComponentTypes] as ElementType;

    if (!Component) {
        throw Error(`${component} is not a valid input component`);
    }

    return <Component {...rest} />;
};

InputWrapper.defaultProps = {
    customComponent: null,
};

export default InputWrapper;
