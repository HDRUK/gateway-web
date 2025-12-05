import { refresh, revalidateTag } from "next/cache";

export const revalidateCache = (tags: string[] | string) => {
    if (Array.isArray(tags)) {
        tags.forEach(tag => {
            revalidateTag(tag, "max");
            refresh();
        });
    } else {
        revalidateTag(tags, "max");
        refresh();
    }
};
