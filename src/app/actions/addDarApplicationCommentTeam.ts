"use server";

import { updateTag } from "next/cache";
import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
import { CACHE_DAR_REVIEWS } from "@/consts/cache";
import { updateDarApplicationCommentTeam } from "@/utils/api";

export const addDarApplicationCommentTeamAction = async (
    applicationId: string,
    reviewId: string,
    teamId: string,
    payload: Partial<DataAccessRequestApplication>
) => {
    try {
        const res = await updateDarApplicationCommentTeam(
            applicationId,
            reviewId,
            teamId,
            payload
        );
        updateTag(`${CACHE_DAR_REVIEWS}${applicationId}`);
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
