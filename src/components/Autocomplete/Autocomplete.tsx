import { ReactNode } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import ClearIcon from "@mui/icons-material/Clear";
import {
    FilterOptionsState,
    InputAdornment,
    ListItemText,
    ChipPropsColorOverrides,
    Chip,
    Tooltip,
} from "@mui/material";
import MuiAutocomplete, {
    createFilterOptions,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { IconType } from "@/interfaces/Ui";
import FormInputWrapper from "@/components/FormInputWrapper";
import Loading from "../Loading";
import Typography from "../Typography";

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
    clearIcon?: boolean;
    chipColor?: keyof ChipPropsColorOverrides;
    maxLabelLength?: number;
}

interface SearchOptions {
    value: unknown;
    label: string;
}

const MAX_DISPLAYED_TAGS = 20;

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
        clearIcon = false,
        chipColor,
        maxLabelLength = 40,
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
                value={field.value ?? []}
                {...restProps}
                freeSolo={freeSolo}
                multiple={multiple}
                defaultValue={[]}
                getOptionLabel={(option: string) => {
                    if (isLoadingOptions) return "Loading...";
                    if (!option) return "";
                    if (Array.isArray(option) && option.length === 0) return "";
                    if (typeof option === "object") return option?.label;
                    return (
                        options.find(
                            item => item.value.toString() === option.toString()
                        )?.label ?? option.toString()
                    );
                }}
                {...(!multiple && {
                    isOptionEqualToValue: (option, value) =>
                        option.value === value?.value || option.value === value,
                })}
                options={options}
                disabled={disabled}
                renderTags={(tagValue, getTagProps) => {
                    const visibleOptions = tagValue.slice(
                        0,
                        MAX_DISPLAYED_TAGS
                    );
                    const additionalOptions =
                        tagValue.length - visibleOptions.length;

                    return [
                        ...visibleOptions.map((option, index) => {
                            const tagProps = getTagProps({ index });
                            const { key, ...restTagProps } = tagProps;

                            const rawLabel =
                                typeof getChipLabel === "function"
                                    ? getChipLabel(options, option)
                                    : option?.label ?? String(option);

                            const truncated =
                                rawLabel && rawLabel.length > maxLabelLength
                                    ? `${rawLabel.slice(0, maxLabelLength)}...`
                                    : null;

                            const label = truncated ?? rawLabel;
                            const isTruncated = truncated !== null;

                            const chip = (
                                <Chip
                                    label={label ?? ""}
                                    size="small"
                                    color={chipColor ?? undefined}
                                    {...restTagProps}
                                    key={option?.label}
                                />
                            );

                            return isTruncated ? (
                                <Tooltip
                                    key={key}
                                    title={rawLabel}
                                    enterDelay={400}
                                    arrow>
                                    {/* Tooltip needs a single child */}
                                    <span style={{ display: "inline-flex" }}>
                                        {chip}
                                    </span>
                                </Tooltip>
                            ) : (
                                <span
                                    key={key}
                                    style={{ display: "inline-flex" }}>
                                    {chip}
                                </span>
                            );
                        }),
                        additionalOptions > 0 ? (
                            <Typography key="more" style={{ marginLeft: 4 }}>
                                + {additionalOptions} more
                            </Typography>
                        ) : null,
                    ];
                }}
                onChange={(_, value) => {
                    let newValue: ValueType | ValueType[] | null = null;

                    if (Array.isArray(value)) {
                        newValue = value.map(v =>
                            typeof v === "object" ? v.value : v
                        );
                    } else if (typeof value === "object" && value !== null) {
                        newValue = value.value;
                    } else {
                        newValue = value;
                    }

                    field.onChange(newValue);
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
                {...(clearIcon && {
                    renderOption: (props, item, { selected }) => (
                        <li {...props} key={item.value as string}>
                            <ListItemText>{item.label}</ListItemText>
                            {selected && <ClearIcon />}
                        </li>
                    ),
                })}
                noOptionsText={
                    isLoadingOptions ? <Loading size={30} /> : noOptionsText
                }
                ListboxProps={{ style: { maxHeight: "35vh" } }}
            />
        </FormInputWrapper>
    );
};

export default Autocomplete;
