"use client";

import { useEffect, useState } from "react";
import { CohortResponse } from "@/interfaces/CohortRequest";
import { getCohortStatusAndRedirect } from "@/app/actions/getCohortStatusAndRedirectAction";

export const useCohortStatus = (userId?: number, redirect = false) => {
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
                const result = await getCohortStatusAndRedirect(
                    userId,
                    redirect
                );
                setData(result);
            } catch (err) {
                console.error("Error fetching cohort status:", err);
                setData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [data, userId]);

    return {
        requestStatus: data?.requestStatus ?? null,
        nhseSdeRequestStatus: data?.nhseSdeRequestStatus ?? null,
        requestExpiry: data?.requestExpiry ?? null,
        redirectUrl: data?.redirectUrl ?? null,
        isLoading,
    };
};
