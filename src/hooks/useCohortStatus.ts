"use client";

import { useCallback, useEffect, useState } from "react";
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

    const fetchData = useCallback(
        async (opts?: { force?: boolean }) => {
            if (!userId) return;
            if (!opts?.force && data) return;

            setIsLoading(true);

            try {
                const result = await getCohortStatusAndRedirect(
                    userId,
                    redirect,
                    useRQuest
                );
                setData(result);
            } catch (err) {
                console.error("Error fetching cohort status:", err);
                setData(null);
            } finally {
                setIsLoading(false);
            }
        },
        [userId, redirect, useRQuest, data]
    );

    useEffect(() => {
        if (!userId || data) {
            setIsLoading(false);
            return;
        }

        fetchData();
    }, [data, userId, redirect, useRQuest]);

    return {
        requestStatus: data?.requestStatus ?? null,
        nhseSdeRequestStatus: data?.nhseSdeRequestStatus ?? null,
        requestExpiry: data?.requestExpiry ?? null,
        redirectUrl: data?.redirectUrl ?? null,
        isLoading,
        refetch: () => fetchData({ force: true }),
    };
};
