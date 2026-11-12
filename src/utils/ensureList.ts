export function ensureList<T>(value: unknown, isValid: (value: unknown) => value is T): T[] {
    if (value == null) {
        return [];
    }

    if (Array.isArray(value)) {
        return value.filter(isValid);
    }

    if (isValid(value)) {
        return [value];
    }

    if (typeof value !== "object") {
        return [];
    }

    return Object.values(value).filter(isValid);
}