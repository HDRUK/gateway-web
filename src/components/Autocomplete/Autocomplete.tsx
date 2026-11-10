import { ReactNode, useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Loading } from "@hdruk/ui";
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
    AutocompleteProps as MuiAutocompleteProps,
    autocompleteClasses,
    createFilterOptions,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { IconType } from "@/interfaces/Ui";
import FormInputWrapper from "@/components/FormInputWrapper";

export type ValueType = string | number;
export type OptionsType = {
    value: ValueType;
    label: string;
    icon?: IconType;
};

export type SelectedType = OptionsType | ValueType;

type MuiProps = MuiAutocompleteProps<SelectedType, boolean, false, boolean>;

export interface AutocompleteProps<T extends FieldValues> {
    label: string;
    info?: string;
    extraInfo?: string;
    disabled?: boolean;
    startAdornmentIcon?: ReactNode;
    createLabel?: string;
    options?: OptionsType[];
    canCreate?: boolean;
    clearOnBlur?: boolean;
    handleHomeEndKeys?: boolean;
    multiple?: boolean;
    getChipLabel?: (
        options: OptionsType[],
        value: SelectedType
    ) => string | undefined;
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
    isOptionEqualToValue?: MuiProps["isOptionEqualToValue"];
    onInputChange?: MuiProps["onInputChange"];
    loading?: boolean;
    groupBy?: MuiProps["groupBy"];
    sx?: MuiProps["sx"];
    ariaLabel?: string;
}

const MAX_DISPLAYED_TAGS = 20;

const valueOf = (selected: SelectedType) =>
    typeof selected === "object" ? selected.value : selected;

const labelOf = (selected: SelectedType) =>
    (typeof selected === "object" ? selected.label : undefined) ??
    String(selected);

const isSameValue = (option: SelectedType, value: SelectedType) =>
    value != null && valueOf(option) === valueOf(value);

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
        isOptionEqualToValue,
        ariaLabel,
        ...restProps
    } = props;

    const [expanded, setExpanded] = useState(false);

    const {
        field: { ref, value, onBlur, onChange, name: fieldName },
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    const rootAttributes = { name: fieldName };

    const filterOptions = (
        searchOptions: SelectedType[],
        params: FilterOptionsState<SelectedType>
    ): SelectedType[] => {
        const filtered = createFilterOptions<SelectedType>()(
            searchOptions,
            params
        );

        const { inputValue } = params;

        const isExisting = searchOptions.some(
            option => inputValue === labelOf(option)
        );

        return inputValue !== "" && !isExisting
            ? [
                  ...filtered,
                  {
                      value: inputValue,
                      label: `${createLabel} "${inputValue}"`,
                  },
              ]
            : filtered;
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
            <MuiAutocomplete<SelectedType, boolean, false, boolean>
                id={id || name}
                {...restProps}
                {...rootAttributes}
                ref={ref}
                value={value ?? (multiple ? [] : null)}
                onBlur={onBlur}
                freeSolo={freeSolo}
                multiple={multiple}
                getOptionLabel={option => {
                    if (isLoadingOptions) return "Loading...";
                    if (!option) return "";
                    if (Array.isArray(option) && option.length === 0) return "";
                    if (typeof option === "object") return option.label;
                    return (
                        options.find(
                            item => item.value.toString() === option.toString()
                        )?.label ?? option.toString()
                    );
                }}
                isOptionEqualToValue={
                    multiple ? isOptionEqualToValue ?? isSameValue : isSameValue
                }
                options={options}
                disabled={disabled}
                renderTags={(tagValue, getTagProps) => {
                    const visibleOptions = expanded
                        ? tagValue
                        : tagValue.slice(0, MAX_DISPLAYED_TAGS);
                    const isOverflowing =
                        visibleOptions.length < tagValue.length;
                    const additionalOptions =
                        tagValue.length - visibleOptions.length;

                    return [
                        ...visibleOptions.map((option, index) => {
                            const tagProps = getTagProps({ index });
                            const { key, ...restTagProps } = tagProps;

                            const rawLabel =
                                (getChipLabel &&
                                    getChipLabel(options, option)) ??
                                labelOf(option);

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
                                />
                            );

                            return isTruncated ? (
                                <Tooltip
                                    key={key}
                                    title={rawLabel}
                                    enterDelay={400}
                                    describeChild
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
                        expanded || isOverflowing ? (
                            <Chip
                                key="toggle"
                                className={autocompleteClasses.tag}
                                size="small"
                                variant="outlined"
                                aria-expanded={expanded}
                                label={
                                    expanded
                                        ? "Show fewer"
                                        : `+ ${additionalOptions} more`
                                }
                                onMouseDown={event => event.preventDefault()}
                                onClick={() => setExpanded(prev => !prev)}
                            />
                        ) : null,
                    ];
                }}
                onChange={(_, selected) => {
                    if (Array.isArray(selected)) {
                        onChange(selected.map(valueOf));
                    } else {
                        onChange(selected === null ? null : valueOf(selected));
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
                        slotProps={{
                            htmlInput: {
                                ...params.inputProps,
                                "aria-label": ariaLabel,
                            },
                        }}
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
                renderOption={(optionProps, item, { selected }) => (
                    <li {...optionProps} key={valueOf(item)}>
                        <ListItemText>{labelOf(item)}</ListItemText>
                        {clearIcon && selected && <ClearIcon />}
                    </li>
                )}
                noOptionsText={
                    isLoadingOptions ? <Loading size={30} /> : noOptionsText
                }
                slotProps={{
                    listbox: { style: { maxHeight: "35vh" } },
                }}
            />
        </FormInputWrapper>
    );
};

export default Autocomplete;
