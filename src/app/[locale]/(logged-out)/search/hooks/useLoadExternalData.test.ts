import { act } from "@testing-library/react";
import { renderHook } from "@/utils/testUtils";
import { ARDC_SOURCE_VALUE } from "@/consts/search";
import { SearchAggregationData } from "@/interfaces/Search";
import useLoadExternalData from "./useLoadExternalData";

jest.mock("@/hooks/useGet");

import useGet from "@/hooks/useGet";

const mockUseGet = useGet as jest.Mock;

const baseV2Data: SearchAggregationData = {
    query: "asthma",
    type: "datasets",
    token: "tok-1",
    pending: [ARDC_SOURCE_VALUE],
    results: {},
};

const ardcResult = {
    hits: [],
    total: 5,
    aggregations: [] as [],
    provider_logo: null,
    about: null,
    ids: [],
};

const resolvedPollData: SearchAggregationData = {
    ...baseV2Data,
    pending: [],
    results: { [ARDC_SOURCE_VALUE]: ardcResult },
};

let capturedOnSuccess: ((data: SearchAggregationData) => void) | undefined;
let capturedOnError: (() => void) | undefined;

beforeEach(() => {
    capturedOnSuccess = undefined;
    capturedOnError = undefined;
    mockUseGet.mockClear();
    mockUseGet.mockImplementation((_url: unknown, options: Record<string, unknown>) => {
        capturedOnSuccess = options?.onSuccess as typeof capturedOnSuccess;
        capturedOnError = options?.onError as typeof capturedOnError;
        return { data: undefined, isLoading: false, mutate: jest.fn() };
    });
});

describe("useLoadExternalData", () => {
    describe("polling gate", () => {
        it("does not poll when there is no token", () => {
            const v2Data = { ...baseV2Data, token: undefined };
            renderHook(() => useLoadExternalData(v2Data, true));

            const [url, options] = mockUseGet.mock.calls[0];
            expect(url).toBeNull();
            expect(options.shouldFetch).toBe(false);
        });

        it("does not poll when enabled is false", () => {
            renderHook(() => useLoadExternalData(baseV2Data, false));

            const [, options] = mockUseGet.mock.calls[0];
            expect(options.shouldFetch).toBe(false);
        });

        it("does not poll when v2Data is undefined", () => {
            renderHook(() => useLoadExternalData(undefined, true));

            const [url, options] = mockUseGet.mock.calls[0];
            expect(url).toBeNull();
            expect(options.shouldFetch).toBe(false);
        });

        it("starts polling with refreshInterval when token exists and enabled", () => {
            renderHook(() => useLoadExternalData(baseV2Data, true));

            const [, options] = mockUseGet.mock.calls[0];
            expect(options.shouldFetch).toBe(true);
            expect(options.refreshInterval).toBe(500);
        });

        it("returns isPolling true while polling", () => {
            const { result } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );
            expect(result.current.isPolling).toBe(true);
        });

        it("returns empty externalResults before any poll resolves", () => {
            const { result } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );
            expect(result.current.externalResults).toEqual({});
        });
    });

    describe("onSuccess — all pending resolved", () => {
        it("stops polling and returns results when all pending providers resolve", () => {
            const { result } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            act(() => capturedOnSuccess?.(resolvedPollData));

            expect(result.current.isPolling).toBe(false);
            expect(result.current.externalResults[ARDC_SOURCE_VALUE]).toEqual(
                ardcResult
            );
        });

        it("continues polling when not all pending providers have resolved", () => {
            const { result } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            act(() => capturedOnSuccess?.({ ...baseV2Data, results: {} }));

            expect(result.current.isPolling).toBe(true);
        });

        it("continues polling when poll response still lists pending providers", () => {
            const { result } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            // Poll response says ARDC is still pending
            act(() =>
                capturedOnSuccess?.({
                    ...baseV2Data,
                    pending: [ARDC_SOURCE_VALUE],
                    results: {},
                })
            );

            expect(result.current.isPolling).toBe(true);
        });
    });

    describe("onError", () => {
        it("stops polling on error", () => {
            const { result } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            act(() => capturedOnError?.());

            expect(result.current.isPolling).toBe(false);
        });

        it("returns empty results after error", () => {
            const { result } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            act(() => capturedOnError?.());

            expect(result.current.externalResults).toEqual({});
        });
    });

    describe("cache behaviour", () => {
        it("serves cached results and stops polling when query+type match", () => {
            let v2Data = baseV2Data;
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(v2Data, true)
            );

            act(() => capturedOnSuccess?.(resolvedPollData));

            v2Data = { ...baseV2Data, token: "tok-2" };
            rerender();

            expect(result.current.isPolling).toBe(false);
            expect(result.current.externalResults[ARDC_SOURCE_VALUE]).toEqual(
                ardcResult
            );
        });

        it("clears cache and restarts polling when query changes", () => {
            let v2Data = baseV2Data;
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(v2Data, true)
            );

            act(() => capturedOnSuccess?.(resolvedPollData));
            expect(result.current.isPolling).toBe(false);

            v2Data = { ...baseV2Data, query: "diabetes", token: "tok-3" };
            rerender();

            expect(result.current.isPolling).toBe(true);
            expect(result.current.externalResults).toEqual({});
        });

        it("serves a revisited query from cache instead of re-polling its expired token", () => {
            const emptyResolved: SearchAggregationData = {
                query: "",
                type: "datasets",
                token: "tok-empty",
                pending: [],
                results: { [ARDC_SOURCE_VALUE]: ardcResult },
            };
            let v2Data: SearchAggregationData = {
                ...emptyResolved,
                pending: [ARDC_SOURCE_VALUE],
                results: {},
            };
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(v2Data, true)
            );

            // Resolve the no-query search
            act(() => capturedOnSuccess?.(emptyResolved));

            // Run a different query and resolve it (overwrites nothing now)
            v2Data = { ...baseV2Data, token: "tok-asthma" };
            rerender();
            act(() =>
                capturedOnSuccess?.({
                    ...baseV2Data,
                    token: "tok-asthma",
                    pending: [],
                    results: { [ARDC_SOURCE_VALUE]: ardcResult },
                })
            );

            // Clear the query: SWR replays the cached no-query response (expired token)
            v2Data = {
                ...emptyResolved,
                pending: [ARDC_SOURCE_VALUE],
                results: {},
            };
            rerender();

            expect(result.current.isPolling).toBe(false);
            expect(result.current.externalResults[ARDC_SOURCE_VALUE]).toEqual(
                ardcResult
            );
        });
    });

    describe("isValidating guard", () => {
        it("does not poll while the aggregation is (re)validating", () => {
            renderHook(() => useLoadExternalData(baseV2Data, true, true));

            const [, options] = mockUseGet.mock.calls[0];
            expect(options.shouldFetch).toBe(false);
        });

        it("polls once validation finishes", () => {
            let isValidating = true;
            const { rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true, isValidating)
            );
            expect(mockUseGet.mock.calls.at(-1)?.[1].shouldFetch).toBe(false);

            isValidating = false;
            rerender();
            expect(mockUseGet.mock.calls.at(-1)?.[1].shouldFetch).toBe(true);
        });
    });
});
