"use server";

import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import { updateDarApplicationCommentUser } from "@/utils/api";

export const addDarApplicationCommentUserAction = async (
    applicationId: string,
    reviewId: string,
    userId: string,
    payload: Partial<DataAccessRequestApplication>
) => {
    try {
        const res = await updateDarApplicationCommentUser(
            applicationId,
            reviewId,
            userId,
            payload
        );
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
