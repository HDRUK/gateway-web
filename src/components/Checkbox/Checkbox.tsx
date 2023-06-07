/** @jsxImportSource @emotion/react */

import MuiCheckbox from "@mui/material/Checkbox";
import { FormControl, FormControlLabel } from "@mui/material";
import { Control, useController } from "react-hook-form";

export interface CheckboxProps {
    label: string;
    name: string;
    control: Control;
}

const Checkbox = (props: CheckboxProps) => {
    const { label, control, name, ...rest } = props;

    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    return (
        <FormControl fullWidth sx={{ m: 0, mb: 2 }} error={!!error}>
            <FormControlLabel
                control={
                    <MuiCheckbox
                        color={error !== undefined ? "error" : "secondary"}
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

export default Checkbox;
