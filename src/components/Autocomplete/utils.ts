import { isValidUrl } from "@/utils/isValidUrl";
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

const formatValidators: Record<
    string,
    { validate: (value: string) => boolean; message: string }
> = {
    url: {
        validate: isValidUrl,
        message: "Please enter a valid URL",
    },
};

const validateFormat = (
    format: string | undefined,
    value: ValueType
): string | null => {
    if (!format || typeof value !== "string") {
        return null;
    }

    const validator = formatValidators[format];

    if (!validator || validator.validate(value)) {
        return null;
    }

    return validator.message;
};

export { getChipLabel, validateFormat };
