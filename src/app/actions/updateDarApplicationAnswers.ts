"use server";

import { updateTag } from "next/cache";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import { CACHE_DAR_ANSWERS } from "@/consts/cache";
import { updateDarAnswers } from "@/utils/api";

export const updateDarApplicationAnswersAction = async (
    applicationId: string,
    userId: string,
    payload: Partial<DataAccessRequestApplication>
) => {
    try {
        const res = await updateDarAnswers(applicationId, userId, payload);
        updateTag(`${CACHE_DAR_ANSWERS}${applicationId}`);
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
