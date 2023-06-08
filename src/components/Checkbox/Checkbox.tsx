/** @jsxImportSource @emotion/react */

import MuiCheckbox, {
    CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import { FormControl, FormControlLabel, SxProps } from "@mui/material";
import { Control, useController } from "react-hook-form";
import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";
import IndeterminateCheckBoxSharpIcon from "@mui/icons-material/IndeterminateCheckBoxSharp";

export interface CheckboxProps extends MuiCheckboxProps {
    label: string;
    name: string;
    control: Control;
    checkboxSx?: SxProps;
    formControlSx?: SxProps;
}

const Checkbox = (props: CheckboxProps) => {
    const { label, control, name, checkboxSx, formControlSx, ...rest } = props;

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return (
        <FormControl
            fullWidth
            sx={{ m: 0, mb: 2, ...formControlSx }}
            error={!!error}>
            <FormControlLabel
                control={
                    <MuiCheckbox
                        color={error !== undefined ? "error" : "secondary"}
                        disableRipple
                        size="medium"
                        icon={<CheckBoxOutlineBlankSharpIcon />}
                        checkedIcon={<CheckBoxSharpIcon />}
                        indeterminateIcon={<IndeterminateCheckBoxSharpIcon />}
                        inputRef={ref}
                        sx={{ fontSize: 14, ...checkboxSx }}
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
    checkboxSx: {},
    formControlSx: {},
};

export default Checkbox;
