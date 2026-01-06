import { refresh, revalidateTag } from "next/cache";

export const revalidateCache = (
    tags: string[] | string,
    refreshCache?: boolean
) => {
    if (Array.isArray(tags)) {
        tags.forEach(tag => {
            revalidateTag(tag, "max");
        });
    } else {
        revalidateTag(tags, "max");
    }

    if (refreshCache) {
        refresh();
    }
};
