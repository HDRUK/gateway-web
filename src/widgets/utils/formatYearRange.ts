import { getYear } from "@/utils/date";

export function formatYearRange(
    start: string | null | undefined,
    end: string | null | undefined,
    fallback: string
): string {
    const startFormatted = start ? getYear(start) : "";
    const endFormatted = end ? getYear(end) : "";

    if (startFormatted && endFormatted) {
        return startFormatted === endFormatted
            ? startFormatted.toString()
            : `${startFormatted}–${endFormatted}`;
    }

    if (startFormatted) return startFormatted.toString();
    if (endFormatted) return endFormatted.toString();

    return fallback;
}
