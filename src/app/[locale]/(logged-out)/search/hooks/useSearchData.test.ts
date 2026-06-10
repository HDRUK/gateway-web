import { renderHook } from "@/utils/testUtils";
import { ARDC_SOURCE_VALUE, HDRUK_SOURCE_VALUE } from "@/consts/search";
import { useSearchData } from "./useSearchData";

const baseProps = {
    isDatasets: true,
    isExternalSourcesEnabled: true,
    v1Data: undefined,
    v2Data: undefined,
    dataSource: HDRUK_SOURCE_VALUE,
    perPage: "25",
    page: "1",
    type: "datasets",
};

const makeV2Data = (
    provider: string,
    overrides: Record<string, unknown> = {}
) => ({
    results: {
        [provider]: {
            hits: [],
            total: 0,
            aggregations: {},
            ...overrides,
        },
    },
});

describe("useSearchData", () => {
    describe("v1 fallback paths", () => {
        it("returns v1Data when isDatasets is false", () => {
            const v1Data = { list: [], total: 5 } as never;
            const { result } = renderHook(() =>
                useSearchData({ ...baseProps, isDatasets: false, v1Data })
            );
            expect(result.current).toBe(v1Data);
        });

        it("returns v1Data when isExternalSourcesEnabled is false", () => {
            const v1Data = { list: [], total: 3 } as never;
            const { result } = renderHook(() =>
                useSearchData({
                    ...baseProps,
                    isExternalSourcesEnabled: false,
                    v1Data,
                })
            );
            expect(result.current).toBe(v1Data);
        });

        it("returns undefined when v2Data is undefined", () => {
            const { result } = renderHook(() =>
                useSearchData({ ...baseProps, v2Data: undefined })
            );
            expect(result.current).toBeUndefined();
        });
    });

    describe("v2 normalisation", () => {
        it("returns normalised data for the HDRUK provider", () => {
            const hits = [{ id: "1" }, { id: "2" }];
            const v2Data = makeV2Data(HDRUK_SOURCE_VALUE, { hits, total: 50 });
            const { result } = renderHook(() =>
                useSearchData({ ...baseProps, v2Data })
            );
            expect(result.current?.list).toHaveLength(2);
            expect(result.current?.total).toBe(50);
            expect(result.current?.elastic_total).toBe(50);
            expect(result.current?.path).toBe("search/datasets");
        });

        it("returns data for the ARDC provider when dataSource is ARDC", () => {
            const v2Data = {
                results: {
                    [ARDC_SOURCE_VALUE]: {
                        hits: [{ id: "3" }],
                        total: 10,
                        aggregations: {},
                    },
                    [HDRUK_SOURCE_VALUE]: { hits: [], total: 0, aggregations: {} },
                },
            };
            const { result } = renderHook(() =>
                useSearchData({
                    ...baseProps,
                    v2Data,
                    dataSource: ARDC_SOURCE_VALUE,
                })
            );
            expect(result.current?.list).toHaveLength(1);
            expect(result.current?.total).toBe(10);
        });

        it("returns an empty list when hits is missing", () => {
            const v2Data = makeV2Data(HDRUK_SOURCE_VALUE, { hits: undefined });
            const { result } = renderHook(() =>
                useSearchData({ ...baseProps, v2Data })
            );
            expect(result.current?.list).toEqual([]);
        });
    });

    describe("pagination", () => {
        it("calculates lastPage correctly", () => {
            const v2Data = makeV2Data(HDRUK_SOURCE_VALUE, { total: 50 });
            const { result } = renderHook(() =>
                useSearchData({ ...baseProps, v2Data, perPage: "25" })
            );
            expect(result.current?.lastPage).toBe(2);
        });

        it("returns lastPage of 1 when total is 0", () => {
            const v2Data = makeV2Data(HDRUK_SOURCE_VALUE, { total: 0 });
            const { result } = renderHook(() =>
                useSearchData({ ...baseProps, v2Data })
            );
            expect(result.current?.lastPage).toBe(1);
        });

        it("calculates from and to for page 2", () => {
            const v2Data = makeV2Data(HDRUK_SOURCE_VALUE, { total: 100 });
            const { result } = renderHook(() =>
                useSearchData({
                    ...baseProps,
                    v2Data,
                    page: "2",
                    perPage: "25",
                })
            );
            expect(result.current?.from).toBe(26);
            expect(result.current?.to).toBe(50);
        });

        it("clamps to to total on the last page", () => {
            const v2Data = makeV2Data(HDRUK_SOURCE_VALUE, { total: 30 });
            const { result } = renderHook(() =>
                useSearchData({
                    ...baseProps,
                    v2Data,
                    page: "2",
                    perPage: "25",
                })
            );
            expect(result.current?.to).toBe(30);
        });
    });

    describe("aggregations", () => {
        it("passes through object aggregations", () => {
            const aggregations = { publisherName: [{ key: "NHS", count: 5 }] };
            const v2Data = makeV2Data(HDRUK_SOURCE_VALUE, { aggregations });
            const { result } = renderHook(() =>
                useSearchData({ ...baseProps, v2Data })
            );
            expect(result.current?.aggregations).toEqual(aggregations);
        });

        it("treats array aggregations as undefined", () => {
            const v2Data = makeV2Data(HDRUK_SOURCE_VALUE, {
                aggregations: [],
            });
            const { result } = renderHook(() =>
                useSearchData({ ...baseProps, v2Data })
            );
            expect(result.current?.aggregations).toBeUndefined();
        });
    });
});
