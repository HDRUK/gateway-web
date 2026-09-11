import {
    ReactNode,
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
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
    autocompleteClasses,
    createFilterOptions,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { IconType } from "@/interfaces/Ui";
import FormInputWrapper from "@/components/FormInputWrapper";
import { countTagsWithinRows } from "./utils";

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

const MAX_COLLAPSED_ROWS = 5;
const RESIZE_SETTLE_MS = 150;

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

    const [expanded, setExpanded] = useState(false);
    const [tagContainer, setTagContainer] = useState<HTMLElement | null>(null);
    const [measured, setMeasured] = useState<{
        valueCount: number;
        visibleCount: number;
    } | null>(null);

    const setInputRef = useCallback(
        (node: HTMLInputElement | null) =>
            setTagContainer(node?.parentElement ?? null),
        []
    );

    const {
        field,
        fieldState: { error },
    } = useController({
        name,
        control,
    });

    const valueCount = Array.isArray(field.value) ? field.value.length : 0;
    const visibleCount =
        measured?.valueCount === valueCount ? measured.visibleCount : null;

    useLayoutEffect(() => {
        if (!tagContainer || expanded || visibleCount !== null) return;

        const offsetTops = Array.from(
            tagContainer.querySelectorAll<HTMLElement>(
                `.${autocompleteClasses.tag}`
            )
        ).map(element => element.offsetTop);

        // Laying the tags out is what tells us how many fit, so the count can
        // only come from the DOM after paint. The guard above caps it at one
        // extra render per value set.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMeasured({
            valueCount,
            visibleCount: countTagsWithinRows(offsetTops, MAX_COLLAPSED_ROWS),
        });
    }, [tagContainer, expanded, visibleCount, valueCount]);

    useEffect(() => {
        let width = window.innerWidth;
        let settleTimer: ReturnType<typeof setTimeout>;

        const handleResize = () => {
            if (width === window.innerWidth) return;

            width = window.innerWidth;

            clearTimeout(settleTimer);
            settleTimer = setTimeout(() => setMeasured(null), RESIZE_SETTLE_MS);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            clearTimeout(settleTimer);
            window.removeEventListener("resize", handleResize);
        };
    }, []);
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
                    const visibleOptions =
                        visibleCount !== null && !expanded
                            ? tagValue.slice(0, visibleCount)
                            : tagValue;
                    const isOverflowing =
                        visibleOptions.length < tagValue.length;
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
                                onClick={() => setExpanded(!expanded)}
                            />
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
                        inputRef={setInputRef}
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
                slotProps={{
                    listbox: { style: { maxHeight: "35vh" } },
                }}
            />
        </FormInputWrapper>
    );
};

export default Autocomplete;
