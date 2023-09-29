/** @jsxImportSource @emotion/react */

import MuiCheckbox, {
    CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import { FormControl, FormControlLabel, SxProps } from "@mui/material";
import { Control, useController } from "react-hook-form";
import {
    CheckBoxOutlineBlankSharpIcon,
    CheckBoxSharpIcon,
    IndeterminateCheckBoxSharpIcon,
} from "@/consts/icons";
import FormError from "@/components/FormError";

export interface CheckboxProps extends MuiCheckboxProps {
    label: string;
    name: string;
    fullWidth: boolean;
    control: Control;
    checkboxSx?: SxProps;
    formControlSx?: SxProps;
}

const Checkbox = (props: CheckboxProps) => {
    const {
        fullWidth = true,
        label,
        control,
        name,
        checkboxSx,
        formControlSx,
        ...rest
    } = props;

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return (
        <FormControl
            fullWidth={fullWidth}
            sx={{ m: 0, mb: 2, ...formControlSx }}
            error={!!error}>
            <FormControlLabel
                control={
                    <MuiCheckbox
                        color={error !== undefined ? "error" : "secondary"}
                        disableRipple
                        checked={fieldProps.value}
                        size="medium"
                        icon={<CheckBoxOutlineBlankSharpIcon />}
                        checkedIcon={<CheckBoxSharpIcon />}
                        indeterminateIcon={<IndeterminateCheckBoxSharpIcon />}
                        inputRef={ref}
                        sx={{ ...checkboxSx }}
                        {...rest}
                        {...fieldProps}
                    />
                }
                label={label}
            />
            {error && <FormError error={error} />}
        </FormControl>
    );
};

Checkbox.defaultProps = {
    checkboxSx: {},
    formControlSx: {},
};

export default Checkbox;
