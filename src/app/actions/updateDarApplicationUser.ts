"use server";

import { updateTag } from "next/cache";
import { DarTeamApplication } from "@/interfaces/DataAccessRequestApplication";
import { CACHE_DAR_APPLICATION } from "@/consts/cache";
import { updateDarApplicationUser } from "@/utils/api";

export const updateDarApplicationUserAction = async (
    applicationId: string,
    userId: string,
    payload: Partial<DarTeamApplication>
) => {
    try {
        const res = await updateDarApplicationUser(
            applicationId,
            userId,
            payload
        );
        updateTag(`${CACHE_DAR_APPLICATION}${applicationId}`);
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
