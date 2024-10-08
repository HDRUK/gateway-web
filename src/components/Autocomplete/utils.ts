import { ValueType } from "./Autocomplete";

const getChipLabel = (
    options: { value: string | number; label: string }[],
    value: ValueType
) => {
    if (typeof value === "string") {
        return value;
    }

    return options.find(option => option.value === value)?.label;
};

export { getChipLabel };
