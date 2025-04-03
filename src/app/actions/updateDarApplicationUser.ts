"use server";

import { cookies } from "next/headers";
import { DarTeamApplication } from "@/interfaces/DataAccessRequestApplication";
import { updateDarApplicationUser } from "@/utils/api";

export const updateDarApplicationUserAction = async (
    applicationId: string,
    userId: string,
    payload: Partial<DarTeamApplication>
) => {
    try {
        const cookieStore = await cookies();

        const res = await updateDarApplicationUser(
            cookieStore,
            applicationId,
            userId,
            payload
        );
        console.log(res);
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
