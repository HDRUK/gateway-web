"use server";

import { revalidateCache } from "@/utils/revalidateCache";

export const revalidateCacheAction = async (tags: string[] | string) => {
    revalidateCache(tags);
};
