"use client";

import { useEffect, useState } from "react";
import { CohortResponse } from "@/interfaces/CohortRequest";
import { getCohortStatusAndRedirect } from "@/app/actions/getCohortStatusAndRedirectAction";

export const useCohortStatus = (userId?: number) => {
    const [data, setData] = useState<CohortResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!userId || data) return;

        const fetchData = async () => {
            setIsLoading(true);

            try {
                const result = await getCohortStatusAndRedirect(userId);
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
        redirectUrl: data?.redirectUrl ?? null,
        isLoading,
    };
};
