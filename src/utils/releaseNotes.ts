import { getYear } from "@/utils/date";

const getReleaseByYear = <T>(releases: T, year: string) => {
    if (!Array.isArray(releases)) return [];

    return releases
        .map(release => release.node)
        .filter(release => {
            const releaseYear = getYear(release.date).toString();
            return releaseYear === year;
        }) as (typeof releases)[number]["node"][];
};

export { getReleaseByYear };
