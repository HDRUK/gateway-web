"use server";

import { DarTeamApplication } from "@/interfaces/DataAccessRequestApplication";
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
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
