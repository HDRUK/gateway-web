import { getYear, getDayjs } from "@/utils/date";

const getReleaseByYear = <T>(releases: T, year: string) => {
    if (!Array.isArray(releases)) return [];

    return releases
        .map(release => release.node)
        .sort((a, b) => {
            return getDayjs(a.release?.releaseDate)?.isBefore(
                getDayjs(b.release.releaseDate)
            )
                ? 1
                : -1;
        })
        .filter(release => {
            const releaseDate = release.release?.releaseDate;

            if (!releaseDate) return false;

            return getYear(releaseDate)?.toString() === year;
        }) as (typeof releases)[number]["node"][];
};

export { getReleaseByYear };
