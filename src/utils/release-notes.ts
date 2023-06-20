import { getYear } from "date-fns";

const getReleaseByYear = (releases, year) => {
    if (!releases) return;
    return releases
        .map(release => release.node)
        .filter(release => {
            const releaseYear = getYear(new Date(release.date)).toString();
            return releaseYear === year;
        });
};

export { getReleaseByYear };
