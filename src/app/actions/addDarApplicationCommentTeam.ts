"use server";

import { DataAccessRequestApplication } from "@/interfaces/DataAccessRequestApplication";
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
        return res;
    } catch (e) {
        console.error(e);
        return null;
    }
};
