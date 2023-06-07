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
import { Control, useController } from "react-hook-form";
import Label from "../Label";
import CharacterLimit from "../CharacterLimit";

export interface TextFieldBaseProps {
    label: string;
    placeholder?: string;
    info?: string;
    // eslint-disable-next-line @typescript-eslint/ban-types
    icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
    };
    setValue?: (name: string, value: string | number) => void;
    name: string;
    multiline?: boolean;
    rows?: number;
    limit?: number;
    disabled?: boolean;
    showClearButton?: boolean;
    control: Control;
    required?: boolean;
}

const TextFieldBase = (props: TextFieldBaseProps) => {
    const {
        label,
        disabled,
        placeholder,
        info,
        icon,
        required,
        limit,
        rows,
        multiline,
        control,
        name,
        setValue,
        showClearButton,
    } = props;

    const theme = useTheme();
    const Icon = icon;
    const {
        field: { ref, ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    if (showClearButton && setValue === undefined) {
        throw Error(
            "You must pass `setValue` if you would like to show the clear button"
        );
    }

    return (
        <FormControl fullWidth sx={{ m: 0, mb: 2 }}>
            <Label
                required={required}
                htmlFor="outlined-adornment-amount"
                label={label}
                sx={{
                    ...(disabled && { color: theme.palette.colors.grey600 }),
                }}
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
            {limit && <CharacterLimit count={0} limit={limit} />}
            <OutlinedInput
                size="small"
                disabled={disabled}
                multiline={multiline}
                rows={rows}
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
                                onClick={() => {
                                    if (typeof setValue === "function") {
                                        setValue(fieldProps.name, "");
                                    }
                                }}
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

TextFieldBase.defaultProps = {
    placeholder: "",
    info: "",
    disabled: false,
    required: false,
    multiline: false,
    rows: undefined,
    icon: undefined,
    setValue: undefined,
    showClearButton: false,
    limit: undefined,
};

export default TextFieldBase;
