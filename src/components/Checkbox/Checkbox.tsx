/** @jsxImportSource @emotion/react */

import MuiCheckbox from "@mui/material/Checkbox";
import { FormControl, FormControlLabel } from "@mui/material";
import {
    Control,
    FieldValues,
    UseControllerProps,
    useController,
} from "react-hook-form";

export interface CheckboxProps {
    label: string;
    name: string;
    control: Control;
    rules?: UseControllerProps<FieldValues, string>;
}

const Checkbox = (props: CheckboxProps) => {
    const { label, control, name, rules, ...rest } = props;

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
        rules: {
            ...rules,
            required: { value: rules.required, message: "This is required" },
        },
    });

    return (
        <FormControl fullWidth sx={{ m: 1 }} error={!!error}>
            <FormControlLabel
                control={
                    <MuiCheckbox
                        color={error !== undefined ? "error" : "secondary"}
                        required={rules.required}
                        disableRipple
                        size="medium"
                        inputRef={ref}
                        {...rest}
                        {...fieldProps}
                    />
                }
                label={label}
            />
        </FormControl>
    );
};

Checkbox.defaultProps = {
    rules: {},
};

export default Checkbox;
