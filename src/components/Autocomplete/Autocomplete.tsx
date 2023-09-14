import {
    FormControl,
    FormHelperText,
    FormLabel,
    FilterOptionsState,
    InputAdornment,
    Chip,
} from "@mui/material";
import MuiAutocomplete, {
    createFilterOptions,
} from "@mui/material/Autocomplete";

import TextField from "@mui/material/TextField";
import { Control, useController } from "react-hook-form";
import { IconType } from "@/interfaces/Ui";
import { ReactNode } from "react";

type ValueType = string | number;
type OptionsType = { id: ValueType; label: string; icon?: IconType }[];

export interface SelectProps {
    label: string;
    info?: string;
    getOptionLabel?: () => string;
    disabled?: boolean;
    startAdornmentIcon?: ReactNode;
    createLabel?: string;
    options: OptionsType;
    canCreate?: boolean;
    multiple?: boolean;
    setValue?: (name: string, value: unknown) => void;
    freeSolo?: boolean;
    placeholder?: string;
    icon?: IconType;
    name: string;
    control: Control;
    required?: boolean;
}

interface SearchOptions {
    value: unknown;
    label: string;
}

const Autocomplete = (props: SelectProps) => {
    const {
        label,
        info,
        createLabel,
        control,
        name,
        placeholder,
        startAdornmentIcon,
        canCreate,
        setValue,
        ...restProps
    } = props;

    const {
        field: { ...fieldProps },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    const filterOptions = (
        options: SearchOptions[],
        params: FilterOptionsState<SearchOptions>
    ) => {
        const filtered = createFilterOptions<SearchOptions>()(options, params);

        const { inputValue } = params;

        const isExisting = options.some(option => inputValue === option.label);
        if (inputValue !== "" && !isExisting) {
            filtered.push({
                value: inputValue,
                label: `${createLabel} "${inputValue}"`,
            });
        }

        return filtered;
    };

    return (
        <FormControl fullWidth>
            <FormLabel>{label}</FormLabel>

            {info && (
                <FormHelperText
                    sx={{
                        fontSize: 13,
                    }}>
                    {info}
                </FormHelperText>
            )}
            <MuiAutocomplete
                {...fieldProps}
                {...restProps}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip
                            label={option?.label || `${option}`}
                            size="small"
                            {...getTagProps({ index })}
                        />
                    ))
                }
                onChange={(e, v) => {
                    if (typeof setValue === "function" && Array.isArray(v)) {
                        const values = v.map(value => {
                            if (typeof value === "string") return value;
                            return value?.value;
                        });
                        setValue(name, values);
                    }
                }}
                {...(canCreate && {
                    filterOptions,
                })}
                renderInput={params => (
                    <TextField
                        {...params}
                        sx={{ padding: 0 }}
                        placeholder={placeholder}
                        InputProps={{
                            ...params.InputProps,
                            ...(startAdornmentIcon && {
                                startAdornment: (
                                    <>
                                        <InputAdornment
                                            sx={{ my: "16px", pl: "5px" }}
                                            position="start">
                                            {startAdornmentIcon}
                                        </InputAdornment>
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                            }),
                        }}
                        size="small"
                    />
                )}
            />
            {error && (
                <FormHelperText sx={{ fontSize: 14 }} error>
                    {error.message}
                </FormHelperText>
            )}
        </FormControl>
    );
};

Autocomplete.defaultProps = {
    getOptionLabel: (option: unknown) => option,
    setValue: () => null,
    placeholder: "",
    info: "",
    createLabel: "Add",
    icon: undefined,
    required: false,
    canCreate: false,
    multiple: false,
    startAdornmentIcon: null,
    freeSolo: false,
    disabled: false,
};

export default Autocomplete;
