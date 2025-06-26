"use server";

import { cookies } from "next/headers";
import { CohortResponse } from "@/interfaces/CohortRequest";
import { getCohortAccessRedirect, getUserCohortRequest } from "@/utils/api";

export const getCohortStatusAndRedirect = async (
    userId: number
): Promise<CohortResponse | null> => {
    try {
        const cookieStore = cookies();

        const [userRequest, accessRedirect] = await Promise.all([
            getUserCohortRequest(cookieStore, userId.toString()),
            getCohortAccessRedirect(cookieStore),
        ]);

        return {
            requestStatus: userRequest.request_status ?? null,
            redirectUrl: accessRedirect.redirect_url ?? null,
        };
    } catch (err) {
        console.error("Cohort server action error:", err);
        return null;
    }
};
