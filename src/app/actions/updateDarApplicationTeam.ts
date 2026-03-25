"use server";

import { updateTag } from "next/cache";
import { DarTeamApplication } from "@/interfaces/DataAccessRequestApplication";
import { CACHE_DAR_APPLICATION } from "@/consts/cache";
import { updateDarApplicationTeam } from "@/utils/api";

export const updateDarApplicationTeamAction = async (
    applicationId: string,
    teamId: string,
    payload: Partial<DarTeamApplication>
) => {
    try {
        const res = await updateDarApplicationTeam(
            applicationId,
            teamId,
            payload
        );
        updateTag(`${CACHE_DAR_APPLICATION}${applicationId}`);
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
