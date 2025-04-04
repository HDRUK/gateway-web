"use server";

import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import { updateDarAnswers } from "@/utils/api";

export const updateDarApplicationAnswersAction = async (
    applicationId: string,
    userId: string,
    payload: Partial<DataAccessRequestApplication>
) => {
    try {
        const res = await updateDarAnswers(applicationId, userId, payload);
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
