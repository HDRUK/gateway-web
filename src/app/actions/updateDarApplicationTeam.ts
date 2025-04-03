"use server";

import { cookies } from "next/headers";
import { DarTeamApplication } from "@/interfaces/DataAccessRequestApplication";
import { updateDarApplicationTeam } from "@/utils/api";

export const updateDarApplicationTeamAction = async (
    applicationId: string,
    teamId: string,
    payload: Partial<DarTeamApplication>
) => {
    try {
        const cookieStore = await cookies();

        const res = await updateDarApplicationTeam(
            cookieStore,
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
