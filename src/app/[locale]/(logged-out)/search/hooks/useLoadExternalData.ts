"use client";

import { useState } from "react";
import apis from "@/config/apis";
import { DataSource } from "@/consts/search";
import useGet from "@/hooks/useGet";
import {
    SearchAggregationData,
    SearchAggregationProviderResult,
    SearchPollData,
} from "@/interfaces/Search";

const useLoadExternalData = (
    v2Data: SearchAggregationData | undefined,
    enabled: boolean
): {
    externalResults: Partial<Record<DataSource, SearchAggregationProviderResult>>;
    isPolling: boolean;
} => {
    const token = v2Data?.token ?? null;
    const query = v2Data?.query ?? "";
    const type  = v2Data?.type  ?? "";

    const [cache, setCache] = useState<{
        query: string;
        type: string;
        results: Partial<Record<DataSource, SearchAggregationProviderResult>>;
    } | null>(null);
    const [polledToken, setPolledToken] = useState<string | null>(null);

    const cachedResults =
        cache?.query === query && cache?.type === type ? cache.results : null;

    const alreadyPolled = !!token && polledToken === token;
    const shouldPoll = enabled && !!token && !alreadyPolled && !cachedResults;

    // Dependent SWR — key is null until token exists; refreshInterval drives polling
    useGet<SearchPollData>(
        token ? `${apis.searchV2AggregationResultsUrl}/${token}` : null,
        {
            shouldFetch: shouldPoll,
            refreshInterval: 500,
            errorNotificationsOn: false,
            onSuccess: data => {
                const allResolved =
                    Array.isArray(data?.pending) && data.pending.length === 0;
                if (allResolved) {
                    setCache({ query, type, results: data?.results ?? {} });
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
