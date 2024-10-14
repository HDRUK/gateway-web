import { getYear } from "./date";

const getNewsEventsByYear = <T>(releases: T, year: string) => {
    if (!Array.isArray(releases)) return [];

    return releases
        .map(release => release.node)
        .filter(release => {
            console.log("release", release);
            const releaseYear = getYear(release.newsFields.date).toString();
            return releaseYear === year;
        }) as (typeof releases)[number]["node"][];
};

export { getNewsEventsByYear };
