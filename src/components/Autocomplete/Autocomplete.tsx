import { ReactNode } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import {
    FilterOptionsState,
    InputAdornment,
    ListItemText,
    Chip,
} from "@mui/material";
import MuiAutocomplete, {
    createFilterOptions,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { IconType } from "@/interfaces/Ui";
import FormInputWrapper from "@/components/FormInputWrapper";
import Loading from "../Loading";

export type ValueType = string | number;
export type OptionsType = {
    value: ValueType;
    label: string;
    icon?: IconType;
};

export interface AutocompleteProps<T extends FieldValues> {
    label: string;
    info?: string;
    extraInfo?: string;
    getOptionLabel?: () => string;
    disabled?: boolean;
    startAdornmentIcon?: ReactNode;
    createLabel?: string;
    options?: OptionsType[];
    canCreate?: boolean;
    clearOnBlur?: boolean;
    handleHomeEndKeys?: boolean;
    multiple?: boolean;
    getChipLabel?: (options: OptionsType[], value: ValueType) => void;
    freeSolo?: boolean;
    selectOnFocus?: boolean;
    placeholder?: string;
    icon?: IconType;
    name: Path<T>;
    control: Control<T>;
    horizontalForm?: boolean;
    required?: boolean;
    id?: string;
    isLoadingOptions?: boolean;
    noOptionsText?: string;
}

interface SearchOptions {
    value: unknown;
    label: string;
}

const Autocomplete = <T extends FieldValues>(props: AutocompleteProps<T>) => {
    const {
        label,
        info,
        extraInfo,
        createLabel = "Add",
        control,
        name,
        placeholder,
        startAdornmentIcon = null,
        canCreate = false,
        getChipLabel,
        horizontalForm,
        required = false,
        options = [],
        disabled = false,
        freeSolo = false,
        multiple = false,
        isLoadingOptions = false,
        noOptionsText = "No options",
        id,
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
            name={name}
            label={label}
            horizontalForm={horizontalForm}
            info={info}
            extraInfo={extraInfo}
            error={error}
            disabled={disabled}
            required={required}>
            <MuiAutocomplete
                id={id || name}
                {...field}
                {...restProps}
                freeSolo={freeSolo}
                multiple={multiple}
                getOptionLabel={(option: string) => {
                    if (typeof option === "object")
                        return option?.label;
                    return (
                        options.find(item => item.value === option)
                            ?.label ?? option.toString()
                    );
                }}
                options={options}
                disabled={disabled}
                renderTags={(tagValue, getTagProps) =>
                    tagValue?.map((option, index) => {
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
                            if (typeof value === "object") return value?.value;
                            return value;
                        });
                        field.onChange(values);
                    }

                    if ((v as OptionsType)?.value) {
                        field.onChange((v as OptionsType).value);
                    }

                    if (!v) {
                        field.onChange(v);
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
                renderOption={(props, item) => (
                    <li {...props} key={item.value as string}>
                        <ListItemText>{item.label}</ListItemText>
                    </li>
                )}
                noOptionsText={
                    isLoadingOptions ? <Loading size={30} /> : noOptionsText
                }
            />
        </FormInputWrapper>
    );
};

export default Autocomplete;
