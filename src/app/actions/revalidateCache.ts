"use server";

import { revalidateTag } from "next/cache";

export const revalidateCache = (tag: string) => {
    revalidateTag(tag);
};
