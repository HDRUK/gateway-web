"use server";

import { cookies } from "next/headers";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import { updateDarAnswers } from "@/utils/api";

export const updateDarApplicationAnswersAction = async (
    applicationId: string,
    userId: string,
    payload: Partial<DataAccessRequestApplication>
) => {
    try {
        const cookieStore = await cookies();

        const res = await updateDarAnswers(
            cookieStore,
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
