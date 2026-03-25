export function formatPopulationSize(
    rawValue: unknown,
    fallbackText: string,
    locale?: string
): string {
    const numericValue =
        typeof rawValue === "number"
            ? rawValue
            : typeof rawValue === "string" && rawValue.trim() !== ""
            ? Number(rawValue)
            : NaN;

    return Number.isFinite(numericValue) && numericValue > 0
        ? numericValue.toLocaleString(locale)
        : fallbackText;
}
