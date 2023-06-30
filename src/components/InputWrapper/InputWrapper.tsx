import React, { ElementType } from "react";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { inputComponents } from "@/config/forms";
import { FieldValues, UseFormGetValues } from "react-hook-form";
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

interface InputWrapperProps<T extends FieldValues> {
    customComponent?: ElementType;
    component: ComponentTypes;
    getValues?: UseFormGetValues<T>;
}

function InputWrapper<T extends FieldValues>({
    component,
    ...props
}: InputWrapperProps<T> & InputType) {
    const { customComponent, getValues, ...rest } = props;
    if (customComponent) {
        const CustomComponent = customComponent;
        return <CustomComponent getValues={getValues} {...rest} />;
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
    const textProps = {
        ...((component === inputComponents.TextArea ||
            component === inputComponents.TextField) && { getValues }),
    };

    return <Component {...textProps} {...rest} />;
}

InputWrapper.defaultProps = {
    customComponent: null,
    getValues: undefined,
};

export default InputWrapper;
