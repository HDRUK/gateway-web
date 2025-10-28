import { formatDate } from "@/utils/date";

export function formatYearRange(
    start: string | null | undefined,
    end: string | null | undefined,
    fallback: string
): string {
    const startFormatted = start ? formatDate(start, "YYYY") : "";
    const endFormatted = end ? formatDate(end, "YYYY") : "";

    if (startFormatted && endFormatted) {
        return startFormatted === endFormatted
            ? startFormatted
            : `${startFormatted}–${endFormatted}`;
    }

    if (startFormatted) return startFormatted;
    if (endFormatted) return endFormatted;

    return fallback;
}
