"use client";

import { useState } from "react";
import {
    SearchAggregationData,
    SearchAggregationProviderResult,
    SearchPollData,
} from "@/interfaces/Search";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { DataSource } from "@/consts/search";

const useLoadExternalData = (
    v2Data: SearchAggregationData | undefined,
    enabled: boolean,
    isValidating = false
): {
    externalResults: Partial<
        Record<DataSource, SearchAggregationProviderResult>
    >;
    isPolling: boolean;
} => {
    const token = v2Data?.token ?? null;
    const query = v2Data?.query ?? "";
    const type = v2Data?.type ?? "";
    const cacheKey = `${query}|${type}`;

    const [cache, setCache] = useState<
        Record<string, Partial<Record<DataSource, SearchAggregationProviderResult>>>
    >({});
    const [polledToken, setPolledToken] = useState<string | null>(null);

    const cachedResults = cache[cacheKey] ?? null;

    const alreadyPolled = !!token && polledToken === token;
    const shouldPoll =
        enabled &&
        !isValidating &&
        !!token &&
        !alreadyPolled &&
        !cachedResults;

    // Dependent SWR — key is null until token exists; refreshInterval drives polling
    useGet<SearchPollData>(
        token ? `${apis.searchV2AggregationResultsUrl}/${token}` : null,
        {
            shouldFetch: shouldPoll,
            refreshInterval: 500,
            errorNotificationsOn: false,
            onSuccess: data => {
                if (!data) {
                    setPolledToken(token);
                    return;
                }
                const allResolved =
                    Array.isArray(data.pending) && data.pending.length === 0;
                if (allResolved) {
                    setCache(prev => ({
                        ...prev,
                        [cacheKey]: data.results ?? {},
                    }));
                    setPolledToken(token);
                }
            },
            onError: () => setPolledToken(token),
        }
    );

    return {
        externalResults: cachedResults ?? {},
        isPolling: shouldPoll,
    };
};

export default useLoadExternalData;
