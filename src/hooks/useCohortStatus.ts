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
    const [isLoading, setIsLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const fetchData = useCallback(async () => {
        if (!userId) {
            setData(null);
            setIsLoading(false);
            setHasFetched(false);
            return;
        }

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
            setHasFetched(true);
        }
    }, [userId, redirect, useRQuest]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        requestStatus: data?.requestStatus ?? null,
        nhseSdeRequestStatus: data?.nhseSdeRequestStatus ?? null,
        requestExpiry: data?.requestExpiry ?? null,
        redirectUrl: data?.redirectUrl ?? null,
        isLoading,
        hasFetched,
        refetch: fetchData,
    };
};
