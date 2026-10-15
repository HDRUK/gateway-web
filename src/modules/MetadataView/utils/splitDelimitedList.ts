export const LIST_DELIMITER = ";,;";

export const isDelimitedList = (value: unknown): value is string =>
    typeof value === "string" && value.includes(LIST_DELIMITER);

export const splitDelimitedList = (value: string): string[] =>
    value
        .split(LIST_DELIMITER)
        .map(item => item.trim())
        .filter(Boolean);
