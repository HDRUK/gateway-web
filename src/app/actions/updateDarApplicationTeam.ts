"use server";

import { DarTeamApplication } from "@/interfaces/DataAccessRequestApplication";
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
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
