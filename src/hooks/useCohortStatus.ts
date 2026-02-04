"use client";

import { useEffect, useState } from "react";
import { CohortResponse } from "@/interfaces/CohortRequest";
import { getCohortStatusAndRedirect } from "@/app/actions/getCohortStatusAndRedirectAction";

type CohortStatusOptions = {
    redirect?: boolean;
    useRQuest?: boolean;
};

export const useCohortStatus = (
    userId?: number,
    { redirect = false, useRQuest = true }: CohortStatusOptions = {}
) => {
    const [data, setData] = useState<CohortResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId || data) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);

            try {
<<<<<<< HEAD
                const result = await getCohortStatusAndRedirect(
                    userId,
                    redirect,
                    useRQuest
                );
=======
                const result = await getCohortStatusAndRedirect(userId);
                console.log("res", result);
>>>>>>> dev
                setData(result);
            } catch (err) {
                console.error("Error fetching cohort status:", err);
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [data, userId, redirect, useRQuest]);

    return {
        requestStatus: data?.requestStatus ?? null,
        nhseSdeRequestStatus: data?.nhseSdeRequestStatus ?? null,
        requestExpiry: data?.requestExpiry ?? null,
        redirectUrl: data?.redirectUrl ?? null,
        isLoading,
    };
};
