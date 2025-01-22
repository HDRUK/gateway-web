export const isValueNumber = (value: unknown): boolean =>
    (typeof value === "number" && !isNaN(value)) ||
    (typeof value === "string" && /^[+-]?\d+(\.\d+)?$/.test(value.trim()));
