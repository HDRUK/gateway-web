/** @jsxImportSource @emotion/react */

import {
    FormControl,
    FormHelperText,
    InputAdornment,
    OutlinedInput,
    IconButton,
    SvgIconTypeMap,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Cancel";

import { useTheme } from "@emotion/react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import {
    Control,
    FieldValues,
    UseControllerProps,
    useController,
} from "react-hook-form";
import Label from "../Label";

export interface TextfieldProps {
    label: string;
    placeholder?: string;
    info?: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
    };
    setValue?: (name: string, value: string | number) => void;
    name: string;
    control: Control;
    rules?: UseControllerProps<FieldValues, string>;
}

const Textfield = (props: TextfieldProps) => {
    const { label, placeholder, info, icon, control, name, rules, setValue } =
        props;

    const theme = useTheme();
    const Icon = icon;
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

    const showClearButton = typeof setValue === "function";

    return (
        <FormControl fullWidth sx={{ m: 1 }}>
            <Label
                required={rules?.required}
                htmlFor="outlined-adornment-amount"
                label={label}
            />
            {info && (
                <FormHelperText
                    sx={{
                        fontSize: 13,
                        color: theme.palette.colors.grey700,
                    }}>
                    {info}
                </FormHelperText>
            )}
            <OutlinedInput
                size="small"
                sx={{ fontSize: 14 }}
                placeholder={placeholder}
                {...(icon &&
                    Icon && {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Icon fontSize="small" color="primary" />
                            </InputAdornment>
                        ),
                    })}
                {...(showClearButton && {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                disableRipple
                                aria-label="clear text"
                                onClick={() => setValue(fieldProps.name, "")}
                                edge="end">
                                <CloseIcon color="disabled" fontSize="small" />
                            </IconButton>
                        </InputAdornment>
                    ),
                })}
                inputRef={ref}
                error={!!error}
                {...fieldProps}
            />

            {error && (
                <FormHelperText sx={{ fontSize: 14 }} error>
                    {error.message}
                </FormHelperText>
            )}
        </FormControl>
    );
};

Textfield.defaultProps = {
    placeholder: "",
    info: "",
    icon: undefined,
    rules: {},
    setValue: undefined,
};

export default Textfield;
