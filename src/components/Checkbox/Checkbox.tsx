import { Control, useController } from "react-hook-form";
import { FormControl, FormControlLabel, SxProps } from "@mui/material";
import { CheckboxProps as MuiCheckboxProps } from "@mui/material/Checkbox";
import FormError from "@/components/FormError";
import Box from "../Box";
import StyledCheckbox from "../StyledCheckbox";
import Typography from "../Typography";

export interface CheckboxProps extends MuiCheckboxProps {
    label?: string;
    name: string;
    size?: "small" | "medium" | "large";
    fullWidth?: boolean;
    control: Control;
    checkboxSx?: SxProps;
    formControlSx?: SxProps;
    count?: number;
}

const Checkbox = (props: CheckboxProps) => {
    const {
        fullWidth = true,
        label = "",
        control,
        name,
        size = "medium",
        checkboxSx,
        formControlSx,
        count,
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
                    <StyledCheckbox
                        color={error !== undefined ? "error" : "secondary"}
                        checked={fieldProps.value}
                        size={size}
                        inputRef={ref}
                        sx={{ ...checkboxSx }}
                        {...rest}
                        {...fieldProps}
                    />
                }
                label={
                    count !== undefined ? (
                        <Box
                            sx={{
                                p: 0,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}>
                            {label}
                            <Typography fontWeight={400}>{count}</Typography>
                        </Box>
                    ) : (
                        label
                    )
                }
            />
            {error && <FormError error={error} />}
        </FormControl>
    );
};

export default Checkbox;
