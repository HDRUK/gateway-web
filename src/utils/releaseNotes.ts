import { Release, ReleaseNode } from "@/interfaces/Releases";
import { getYear } from "date-fns";

const getReleaseByYear = (
    releases: ReleaseNode[],
    year: string
): Release[] | [] => {
    if (!Array.isArray(releases)) return [];
    return releases
        .map(release => release.node)
        .filter(release => {
            const releaseYear = getYear(new Date(release.date)).toString();
            return releaseYear === year;
        });
};

export { getReleaseByYear };
