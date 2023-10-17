import { FilterOptionsState, InputAdornment, Chip } from "@mui/material";
import MuiAutocomplete, {
    createFilterOptions,
} from "@mui/material/Autocomplete";

import TextField from "@mui/material/TextField";
import { Control, useController } from "react-hook-form";
import { IconType } from "@/interfaces/Ui";
import { ReactNode } from "react";
import FormInputWrapper from "../FormInputWrapper";

type ValueType = string | number;
type OptionsType = { id: ValueType; label: string; icon?: IconType }[];

export interface AutocompleteProps {
    label: string;
    info?: string;
    getOptionLabel?: () => string;
    disabled?: boolean;
    startAdornmentIcon?: ReactNode;
    createLabel?: string;
    options?: OptionsType;
    canCreate?: boolean;
    clearOnBlur?: boolean;
    handleHomeEndKeys?: boolean;
    multiple?: boolean;
    trigger?: (name: string) => void;
    freeSolo?: boolean;
    selectOnFocus?: boolean;
    placeholder?: string;
    icon?: IconType;
    name: string;
    control: Control;
    horizontalForm?: boolean;
    required?: boolean;
}

interface SearchOptions {
    value: unknown;
    label: string;
}

const Autocomplete = (props: AutocompleteProps) => {
    const {
        label,
        info,
        createLabel,
        control,
        trigger,
        name,
        placeholder,
        startAdornmentIcon,
        canCreate,
        horizontalForm,
        required,
        disabled,
        ...restProps
    } = props;

    const {
        field,
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
        <FormInputWrapper
            label={label}
            horizontalForm={horizontalForm}
            info={info}
            error={error}
            disabled={disabled}
            required={required}>
            <MuiAutocomplete
                {...field}
                {...restProps}
                disabled={disabled}
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
                    if (Array.isArray(v)) {
                        const values = v.map(value => {
                            if (typeof value === "string") return value;
                            return value?.value;
                        });
                        field.onChange(values);
                        if (typeof trigger === "function") {
                            trigger(name);
                        }
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
        </FormInputWrapper>
    );
};

Autocomplete.defaultProps = {
    getOptionLabel: (option: string | { label: string; value: unknown }) => {
        if (typeof option === "string") return option;
        return option?.label;
    },
    placeholder: "",
    info: "",
    createLabel: "Add",
    icon: undefined,
    options: [],
    required: false,
    canCreate: false,
    multiple: false,
    startAdornmentIcon: null,
    freeSolo: false,
    disabled: false,
};

export default Autocomplete;
