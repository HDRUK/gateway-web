"use server";

import { updateTag } from "next/cache";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import { CACHE_DAR_REVIEWS } from "@/consts/cache";
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
        updateTag(`${CACHE_DAR_REVIEWS}${applicationId}`);
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
