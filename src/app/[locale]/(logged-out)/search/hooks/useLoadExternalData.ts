"use client";

import { useEffect, useRef, useState } from "react";
import {
    SearchAggregationData,
    SearchAggregationProviderResult,
    SearchPollData,
} from "@/interfaces/Search";
import useGet from "@/hooks/useGet";
import apis from "@/config/apis";
import { DataSource } from "@/consts/search";

const MAX_POLL_FAILURES = 3;

const useLoadExternalData = (
    v2Data: SearchAggregationData | undefined,
    enabled: boolean,
    isValidating = false,
    refreshAggregation?: () => unknown
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
        Record<
            string,
            Partial<Record<DataSource, SearchAggregationProviderResult>>
        >
    >({});
    const [pollFailures, setPollFailures] = useState<{
        token: string | null;
        count: number;
    }>({ token: null, count: 0 });
    const reissuedFor = useRef<string | null>(null);

    const failures = pollFailures.token === token ? pollFailures.count : 0;

    const cachedResults = cache[cacheKey] ?? null;

    const shouldPoll =
        enabled &&
        !isValidating &&
        !!token &&
        !cachedResults &&
        failures < MAX_POLL_FAILURES;

    // swr calls back for a key it has already moved on from, so ignore
    // anything arriving once we have stopped asking
    const recordPoll = (succeeded: boolean) => {
        if (!shouldPoll) return;

        setPollFailures(prev => {
            if (succeeded) {
                return prev.token === token && prev.count === 0
                    ? prev
                    : { token, count: 0 };
            }
            const current = prev.token === token ? prev.count : 0;
            return { token, count: current + 1 };
        });
    };

    // Dependent SWR — key is null until token exists; refreshInterval drives polling
    const { data: pollData } = useGet<SearchPollData>(
        token ? `${apis.searchV2AggregationResultsUrl}/${token}` : null,
        {
            shouldFetch: shouldPoll,
            refreshInterval: 500,
            errorNotificationsOn: false,
            onSuccess: data => recordPoll(!!data),
            // unreachable while the api service resolves null instead of throwing
            onError: () => recordPoll(false),
        }
    );

    const allResolved =
        !!pollData &&
        Array.isArray(pollData.pending) &&
        pollData.pending.length === 0;

    const tokenExhausted =
        enabled &&
        !isValidating &&
        !!token &&
        !cachedResults &&
        failures >= MAX_POLL_FAILURES;

    useEffect(() => {
        if (!tokenExhausted || reissuedFor.current === cacheKey) return;

        reissuedFor.current = cacheKey;
        // mutate rejects when the retry fails; postFetch has already notified
        refreshAggregation &&
            Promise.resolve(refreshAggregation()).catch(() => {});
    }, [tokenExhausted, cacheKey, refreshAggregation]);

    if (allResolved && !cachedResults) {
        setCache(prev => ({
            ...prev,
            [cacheKey]: pollData.results ?? {},
        }));
    }

    return {
        externalResults: cachedResults ?? {},
        isPolling: shouldPoll,
    };
};

export default useLoadExternalData;
