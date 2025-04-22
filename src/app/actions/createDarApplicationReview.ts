"use server";

import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import { createDarApplicationReview } from "@/utils/api";

export const createDarApplicationReviewAction = async (
    applicationId: string,
    teamId: string,
    payload: Partial<DataAccessRequestApplication>
) => {
    try {
        const res = await createDarApplicationReview(
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
