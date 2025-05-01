"use server";

import { revalidateTag } from "next/cache";

export const revalidateCache = (tags: string[] | string) => {
    if (Array.isArray(tags)) {
        tags.forEach(tag => {
            revalidateTag(tag);
        });
    } else {
        revalidateTag(tags);
    }
};
