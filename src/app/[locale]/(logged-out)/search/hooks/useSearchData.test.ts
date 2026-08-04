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
    query: "test",
    type: "datasets",
    results: {
        [provider]: {
            hits: [],
            total: 0,
            aggregations: [] as [],
            provider_logo: null,
            about: null,
            ids: [],
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

    describe("typesense publications", () => {
        const publicationProps = {
            ...baseProps,
            isDatasets: false,
            isExternalSourcesEnabled: false,
            isTypesenseSearch: true,
            type: "publications",
        };

        it("returns normalised publication data from the HDRUK provider", () => {
            const hits = [{ _id: "1", paper_title: "Paper one" }];
            const v2Data = {
                ...makeV2Data(HDRUK_SOURCE_VALUE, { hits, total: 1 }),
                type: "publications",
            };
            const { result } = renderHook(() =>
                useSearchData({ ...publicationProps, v2Data })
            );
            expect(result.current?.list).toEqual(hits);
            expect(result.current?.total).toBe(1);
            expect(result.current?.path).toBe("search/publications");
        });

        it("returns undefined while v2Data is loading", () => {
            const { result } = renderHook(() =>
                useSearchData({ ...publicationProps, v2Data: undefined })
            );
            expect(result.current).toBeUndefined();
        });

        it("returns v1Data when isTypesenseSearch is false", () => {
            const v1Data = { list: [], total: 2 } as never;
            const { result } = renderHook(() =>
                useSearchData({
                    ...publicationProps,
                    isTypesenseSearch: false,
                    v1Data,
                })
            );
            expect(result.current).toBe(v1Data);
        });
    });

    describe("typesense data custodians", () => {
        const dataCustodianProps = {
            ...baseProps,
            isDatasets: false,
            isExternalSourcesEnabled: false,
            isTypesenseSearch: true,
            type: "data_custodians",
        };

        it("returns normalised data custodian data from the HDRUK provider", () => {
            const hits = [{ _id: "1", name: "Team A", team_logo: "" }];
            const v2Data = {
                ...makeV2Data(HDRUK_SOURCE_VALUE, { hits, total: 1 }),
                type: "data_custodians",
            };
            const { result } = renderHook(() =>
                useSearchData({ ...dataCustodianProps, v2Data })
            );
            expect(result.current?.list).toEqual(hits);
            expect(result.current?.total).toBe(1);
            expect(result.current?.path).toBe("search/data_custodians");
        });

        it("returns undefined while v2Data is loading", () => {
            const { result } = renderHook(() =>
                useSearchData({ ...dataCustodianProps, v2Data: undefined })
            );
            expect(result.current).toBeUndefined();
        });

        it("returns v1Data when isTypesenseSearch is false", () => {
            const v1Data = { list: [], total: 2 } as never;
            const { result } = renderHook(() =>
                useSearchData({
                    ...dataCustodianProps,
                    isTypesenseSearch: false,
                    v1Data,
                })
            );
            expect(result.current).toBe(v1Data);
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
                query: "test",
                type: "datasets",
                results: {
                    [ARDC_SOURCE_VALUE]: {
                        hits: [{ id: "3", slug: "slug-3" }],
                        total: 10,
                        aggregations: [] as [],
                        provider_logo: null,
                        about: null,
                        ids: [],
                    },
                    [HDRUK_SOURCE_VALUE]: {
                        hits: [],
                        total: 0,
                        aggregations: [] as [],
                        provider_logo: null,
                        about: null,
                        ids: [],
                    },
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
