"use server";

import { revalidateCache } from "@/utils/revalidateCache";

export const revalidateCacheAction = (tags: string[] | string) => {
    revalidateCache(tags);
};
