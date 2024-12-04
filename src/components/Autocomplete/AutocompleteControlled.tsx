import { ReactNode } from "react";
import {
    Control,
    Controller,
    FieldValues,
    Path,
    useController,
} from "react-hook-form";
import {
    InputAdornment,
    Autocomplete,
    FilterOptionsState,
    createFilterOptions,
} from "@mui/material";
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

const AutocompleteControlled = <T extends FieldValues>(
    props: AutocompleteProps<T>
) => {
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
    } = props;

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
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => {
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
                        <Autocomplete
                            {...(!multiple && {
                                value: field.value
                                    ? options.find(option => {
                                          return field.value === option.value;
                                      }) ?? null
                                    : null,
                            })}
                            {...(canCreate && {
                                filterOptions,
                            })}
                            {...field}
                            {...props}
                            freeSolo={freeSolo}
                            multiple={multiple}
                            options={options}
                            getOptionLabel={(option: string) => {
                                if (typeof option === "object")
                                    return option?.label;
                                return (
                                    options.find(item => item.value === option)
                                        ?.label ?? option.toString()
                                );
                            }}
                            onChange={(_, data) => field.onChange(data)}
                            isOptionEqualToValue={(option, value) =>
                                option.value === value?.value ||
                                option.value === value
                            }
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
                                                        sx={{
                                                            my: "16px",
                                                            pl: "5px",
                                                        }}
                                                        position="start">
                                                        {startAdornmentIcon}
                                                    </InputAdornment>
                                                    {
                                                        params.InputProps
                                                            .startAdornment
                                                    }
                                                </>
                                            ),
                                        }),
                                    }}
                                    size="small"
                                />
                            )}
                            noOptionsText={
                                isLoadingOptions ? (
                                    <Loading size={30} />
                                ) : (
                                    noOptionsText
                                )
                            }
                        />
                    </FormInputWrapper>
                );
            }}
        />
    );
};

export default AutocompleteControlled;
