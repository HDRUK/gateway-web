import { FilterOptionsState, InputAdornment, Chip } from "@mui/material";
import MuiAutocomplete, {
    createFilterOptions,
} from "@mui/material/Autocomplete";

import TextField from "@mui/material/TextField";
import { Control, useController } from "react-hook-form";
import { IconType } from "@/interfaces/Ui";
import { ReactNode } from "react";
import FormInputWrapper from "../FormInputWrapper";

export type ValueType = string | number;
export type OptionsType = {
    value: ValueType;
    label: string;
    icon?: IconType;
}[];

export interface AutocompleteProps {
    label: string;
    info?: string;
    extraInfo?: string;
    getOptionLabel?: () => string;
    disabled?: boolean;
    startAdornmentIcon?: ReactNode;
    createLabel?: string;
    options?: OptionsType;
    canCreate?: boolean;
    clearOnBlur?: boolean;
    handleHomeEndKeys?: boolean;
    multiple?: boolean;
    getChipLabel?: (options: OptionsType, value: ValueType) => void;
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
        extraInfo,
        createLabel,
        control,
        trigger,
        name,
        placeholder,
        startAdornmentIcon,
        canCreate,
        getChipLabel,
        horizontalForm,
        required,
        options = [],
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
        searchOptions: SearchOptions[],
        params: FilterOptionsState<SearchOptions>
    ) => {
        const filtered = createFilterOptions<SearchOptions>()(
            searchOptions,
            params
        );

        const { inputValue } = params;

        const isExisting = searchOptions.some(
            option => inputValue === option.label
        );
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
            extraInfo={extraInfo}
            error={error}
            disabled={disabled}
            required={required}>
            <MuiAutocomplete
                {...field}
                {...restProps}
                options={options}
                disabled={disabled}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => {
                        const chipLabel =
                            typeof getChipLabel === "function"
                                ? getChipLabel(options, option)
                                : option?.label || `${option}`;
                        return (
                            <Chip
                                label={chipLabel || ""}
                                size="small"
                                {...getTagProps({ index })}
                            />
                        );
                    })
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
