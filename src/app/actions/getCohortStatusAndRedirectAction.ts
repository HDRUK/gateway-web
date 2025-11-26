"use server";

import { CohortResponse } from "@/interfaces/CohortRequest";
import { getCohortAccessRedirect, getUserCohortRequest } from "@/utils/api";
import { getSessionCookie } from "@/utils/getSessionCookie";
import { logger } from "@/utils/logger";

export const getCohortStatusAndRedirect = async (
    userId: number,
    redirect = false
): Promise<CohortResponse | null> => {
    try {
        const [userRequest, accessRedirect] = await Promise.all([
            getUserCohortRequest(userId.toString()),
            redirect ? getCohortAccessRedirect() : { redirect_url: "" },
        ]);
        return {
            requestStatus: userRequest?.request_status ?? null,
            nhseSdeRequestStatus: userRequest?.nhse_sde_request_status ?? null,
            requestExpiry: userRequest?.request_expire_at ?? null,
            redirectUrl: accessRedirect?.redirect_url ?? null,
        };
    } catch (error) {
        const session = await getSessionCookie();
        const err = error as {
            response?: {
                status: number;
                data?: { message: string };
            };
            stack?: unknown;
            message: string;
        };
        logger.error(err, session, `cohort_request`);

        return null;
    }
};
