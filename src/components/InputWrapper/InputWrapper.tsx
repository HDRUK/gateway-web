import React, { ElementType } from "react";
import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { inputComponents } from "@/config/forms";
import { FieldValues, UseFormGetValues } from "react-hook-form";
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
    setValue?: unknown;
    trigger?: unknown;
    watch?: (name: string) => void;
}

function InputWrapper<T extends FieldValues>({
    component,
    ...props
}: InputWrapperProps<T> & InputType) {
    const { customComponent, getValues, setValue, watch, trigger, ...rest } =
        props;
    if (customComponent) {
        const CustomComponent = customComponent;
        return <CustomComponent getValues={getValues} {...rest} />;
    }

    const inputs = {
        Autocomplete,
        Switch,
        CheckboxGroup,
        CheckboxRow,
        Checkbox,
        TextField,
        Select,
        RadioGroup,
        TextArea,
    };

    const Component = inputs[component as ComponentTypes] as ElementType;

    if (!Component) {
        throw Error(`${component} is not a valid input component`);
    }
    const textProps = {
        ...((component === inputComponents.TextArea ||
            component === inputComponents.TextField) && { getValues }),
        ...((component === inputComponents.Autocomplete ||
            component === inputComponents.Autocomplete) && {
            setValue,
            watch,
            trigger,
        }),
    };

    return <Component {...textProps} {...rest} />;
}

InputWrapper.defaultProps = {
    customComponent: null,
    getValues: undefined,
    setValue: undefined,
    watch: undefined,
};

export default InputWrapper;
