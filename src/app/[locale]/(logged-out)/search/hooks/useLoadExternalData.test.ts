import { act } from "@testing-library/react";
import { renderHook } from "@/utils/testUtils";
import { ARDC_SOURCE_VALUE } from "@/consts/search";
import { SearchAggregationData, SearchPollData } from "@/interfaces/Search";
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

const resolvedPollData: SearchPollData = {
    pending: [],
    results: { [ARDC_SOURCE_VALUE]: ardcResult },
};

const pendingPollData: SearchPollData = {
    pending: [ARDC_SOURCE_VALUE],
    results: {},
};

// the hook only ever sees poll data belonging to the token in its own swr key,
// so the mock is driven per url
let pollDataByUrl: Record<string, SearchPollData | null | undefined> = {};
let capturedOnSuccess: ((data: SearchPollData | null) => void) | undefined;
let capturedOnError: (() => void) | undefined;

// the api service swallows http errors and resolves null, so this — not
// onError — is how a failed poll actually reaches the hook
const failPoll = (times = 1) => {
    for (let i = 0; i < times; i += 1) {
        capturedOnSuccess?.(null);
    }
};

const succeedPoll = (data: SearchPollData) => capturedOnSuccess?.(data);

beforeEach(() => {
    pollDataByUrl = {};
    capturedOnSuccess = undefined;
    capturedOnError = undefined;
    mockUseGet.mockClear();
    mockUseGet.mockImplementation(
        (url: string | null, options: Record<string, unknown>) => {
            capturedOnSuccess = options?.onSuccess as typeof capturedOnSuccess;
            capturedOnError = options?.onError as typeof capturedOnError;

            const data =
                url && options?.shouldFetch ? pollDataByUrl[url] : undefined;

            return { data, isLoading: false, mutate: jest.fn() };
        }
    );
});

const lastOptions = () => mockUseGet.mock.calls.at(-1)?.[1];

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

        it("polls the url for the current token", () => {
            renderHook(() => useLoadExternalData(baseV2Data, true));

            const [url] = mockUseGet.mock.calls[0];
            expect(url).toContain("tok-1");
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

    describe("resolved polls", () => {
        it("stops polling and returns results when all pending providers resolve", () => {
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            const [url] = mockUseGet.mock.calls[0];
            pollDataByUrl[url] = resolvedPollData;
            rerender();

            expect(result.current.isPolling).toBe(false);
            expect(result.current.externalResults[ARDC_SOURCE_VALUE]).toEqual(
                ardcResult
            );
        });

        it("continues polling when the poll response still lists pending providers", () => {
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            const [url] = mockUseGet.mock.calls[0];
            pollDataByUrl[url] = pendingPollData;
            rerender();

            expect(result.current.isPolling).toBe(true);
            expect(result.current.externalResults).toEqual({});
        });
    });

    describe("failed polls", () => {
        it("continues polling when a poll resolves null", () => {
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            const [url] = mockUseGet.mock.calls[0];
            pollDataByUrl[url] = null;
            rerender();

            expect(result.current.isPolling).toBe(true);
            expect(result.current.externalResults).toEqual({});
        });

        it("gives up after three consecutive failures", () => {
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            act(() => failPoll(3));
            rerender();

            expect(result.current.isPolling).toBe(false);
            expect(result.current.externalResults).toEqual({});
        });

        it("ignores polls that land after it stopped asking", () => {
            let isValidating = true;
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true, isValidating)
            );

            // a superseded request resolves while polling is paused
            act(() => failPoll(3));
            rerender();

            isValidating = false;
            rerender();

            expect(result.current.isPolling).toBe(true);
        });

        it("counts failures via onError should the api service ever throw", () => {
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            act(() => {
                for (let i = 0; i < 3; i += 1) {
                    capturedOnError?.();
                }
            });
            rerender();

            expect(result.current.isPolling).toBe(false);
        });

        it("keeps polling a slow provider that has not failed", () => {
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            const [url] = mockUseGet.mock.calls[0];
            pollDataByUrl[url] = pendingPollData;

            act(() => {
                for (let i = 0; i < 10; i += 1) {
                    succeedPoll(pendingPollData);
                }
            });
            rerender();

            expect(result.current.isPolling).toBe(true);
        });

        it("resets the failure count when a poll succeeds", () => {
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true)
            );

            act(() => {
                failPoll(2);
                succeedPoll(pendingPollData);
                failPoll(2);
            });
            rerender();

            expect(result.current.isPolling).toBe(true);
        });

        it("polls again for a new token after giving up", () => {
            let v2Data = baseV2Data;
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(v2Data, true)
            );

            act(() => failPoll(3));
            rerender();
            expect(result.current.isPolling).toBe(false);

            v2Data = { ...baseV2Data, token: "tok-retry" };
            rerender();

            expect(result.current.isPolling).toBe(true);
            expect(mockUseGet.mock.calls.at(-1)?.[0]).toContain("tok-retry");
        });
    });

    describe("a token that only ever fails", () => {
        it("asks for a fresh aggregation once the failure budget is spent", () => {
            const refreshAggregation = jest.fn();
            const { rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true, false, refreshAggregation)
            );

            act(() => failPoll(3));
            rerender();

            expect(refreshAggregation).toHaveBeenCalledTimes(1);
        });

        it("does not ask again for the same query", () => {
            const refreshAggregation = jest.fn();
            let v2Data = baseV2Data;
            const { rerender } = renderHook(() =>
                useLoadExternalData(v2Data, true, false, refreshAggregation)
            );

            act(() => failPoll(3));
            rerender();

            // the fresh token fails too
            v2Data = { ...baseV2Data, token: "tok-fresh" };
            rerender();
            act(() => failPoll(3));
            rerender();

            expect(refreshAggregation).toHaveBeenCalledTimes(1);
        });

        it("asks again when the query changes", () => {
            const refreshAggregation = jest.fn();
            let v2Data = baseV2Data;
            const { rerender } = renderHook(() =>
                useLoadExternalData(v2Data, true, false, refreshAggregation)
            );

            act(() => failPoll(3));
            rerender();

            v2Data = { ...baseV2Data, query: "diabetes", token: "tok-2" };
            rerender();
            act(() => failPoll(3));
            rerender();

            expect(refreshAggregation).toHaveBeenCalledTimes(2);
        });

        it("does not ask when the poll has not failed", () => {
            const refreshAggregation = jest.fn();
            const { rerender } = renderHook(() =>
                useLoadExternalData(baseV2Data, true, false, refreshAggregation)
            );

            act(() => succeedPoll(pendingPollData));
            rerender();

            expect(refreshAggregation).not.toHaveBeenCalled();
        });
    });

    describe("superseded tokens", () => {
        it("does not cache a poll belonging to a superseded token", () => {
            let v2Data = baseV2Data;
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(v2Data, true)
            );

            const [firstUrl] = mockUseGet.mock.calls[0];

            // the user searches again before the first poll resolves
            v2Data = { ...baseV2Data, query: "diabetes", token: "tok-2" };
            rerender();

            // the first token's poll resolves late
            pollDataByUrl[firstUrl] = resolvedPollData;
            rerender();

            expect(result.current.externalResults).toEqual({});
            expect(result.current.isPolling).toBe(true);
        });
    });

    describe("cache behaviour", () => {
        it("serves cached results and stops polling when query+type match", () => {
            let v2Data = baseV2Data;
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(v2Data, true)
            );

            const [url] = mockUseGet.mock.calls[0];
            pollDataByUrl[url] = resolvedPollData;
            rerender();

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

            const [url] = mockUseGet.mock.calls[0];
            pollDataByUrl[url] = resolvedPollData;
            rerender();
            expect(result.current.isPolling).toBe(false);

            v2Data = { ...baseV2Data, query: "diabetes", token: "tok-3" };
            rerender();

            expect(result.current.isPolling).toBe(true);
            expect(result.current.externalResults).toEqual({});
        });

        it("serves a revisited query from cache instead of re-polling its expired token", () => {
            const emptyQueryV2Data: SearchAggregationData = {
                query: "",
                type: "datasets",
                token: "tok-empty",
                pending: [ARDC_SOURCE_VALUE],
                results: {},
            };
            let v2Data: SearchAggregationData = emptyQueryV2Data;
            const { result, rerender } = renderHook(() =>
                useLoadExternalData(v2Data, true)
            );

            // Resolve the no-query search
            const [emptyUrl] = mockUseGet.mock.calls[0];
            pollDataByUrl[emptyUrl] = resolvedPollData;
            rerender();

            // Run a different query and resolve it (overwrites nothing now)
            v2Data = { ...baseV2Data, token: "tok-asthma" };
            rerender();
            const [asthmaUrl] = mockUseGet.mock.calls.at(-1) as [string];
            pollDataByUrl[asthmaUrl] = resolvedPollData;
            rerender();

            // Clear the query: SWR replays the cached no-query response (expired token)
            v2Data = emptyQueryV2Data;
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
            expect(lastOptions().shouldFetch).toBe(false);

            isValidating = false;
            rerender();
            expect(lastOptions().shouldFetch).toBe(true);
        });
    });
});
