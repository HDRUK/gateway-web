import { SearchCategory, ViewType } from "@/interfaces/Search";
import {
    canDownloadResults,
    exceedsResultLimit,
    getResultsView,
    getFilterCount,
    getResultsListLayout,
    getResultsState,
    shouldHideTotal,
    showPartnerBanner,
} from "./results";

describe("results utils", () => {
    it.each([
        [{ elastic_total: 50, total: 50 }, false, false],
        [{ elastic_total: 150, total: 100 }, true, true],
        [{ elastic_total: 150, total: 120 }, true, false],
    ])("%o exceeds %s and hides total %s", (data, exceeds, hides) => {
        expect(exceedsResultLimit(data)).toBe(exceeds);
        expect(shouldHideTotal(data)).toBe(hides);
    });

    it.each([
        [SearchCategory.DATASETS, undefined, undefined, ViewType.TABLE],
        [SearchCategory.DATASETS, undefined, ViewType.LIST, ViewType.LIST],
        [
            SearchCategory.DATASETS,
            ViewType.TABLE,
            ViewType.LIST,
            ViewType.TABLE,
        ],
        [SearchCategory.DATASETS, "bogus", undefined, ViewType.TABLE],
        [SearchCategory.TOOLS, ViewType.TABLE, ViewType.TABLE, ViewType.LIST],
    ])(
        "%s with url view %s and cookie %s is %s",
        (type, urlView, cookieView, expected) => {
            expect(getResultsView(type, urlView, cookieView)).toBe(expected);
        }
    );

    it.each([
        [SearchCategory.COLLECTIONS, "tiled", 4, true],
        [SearchCategory.DATA_CUSTODIANS, "tiled", undefined, true],
        [SearchCategory.TOOLS, "list", undefined, false],
    ])(
        "lays out %s as %s",
        (type, variant, maxDesktopColumns, fillDanglingSingleCard) => {
            expect(getResultsListLayout(type)).toEqual({
                variant,
                maxDesktopColumns,
                fillDanglingSingleCard,
            });
        }
    );

    it("counts selected filter values", () => {
        expect(
            getFilterCount({
                publisherName: ["A", "B"],
                dateRange: ["2010", ""],
                query: "ignored",
            })
        ).toBe(4);
    });

    it.each([
        [SearchCategory.DATASETS, false, true],
        [SearchCategory.DATASETS, true, false],
        [SearchCategory.DATA_CUSTODIANS, false, false],
    ])("%s with external source %s can download %s", (type, external, expected) => {
        expect(canDownloadResults(type, external)).toBe(expected);
    });

    describe("showPartnerBanner", () => {
        const base = {
            isDatasets: true,
            isExternalSourceSelected: false,
            isExternalSourcesEnabled: true,
            partnerTotal: 0,
            isSearching: false,
            isExternalPolling: false,
        };

        it.each([
            ["partner results exist", { partnerTotal: 3 }, true],
            ["searching", { isSearching: true }, true],
            ["polling", { isExternalPolling: true }, true],
            ["no partner results", {}, false],
            ["not datasets", { isDatasets: false, partnerTotal: 3 }, false],
            [
                "partner source selected",
                { isExternalSourceSelected: true, partnerTotal: 3 },
                false,
            ],
            [
                "external sources disabled",
                { isExternalSourcesEnabled: false, partnerTotal: 3 },
                false,
            ],
        ])("%s", (_, params, expected) => {
            expect(showPartnerBanner({ ...base, ...params })).toBe(expected);
        });
    });

    describe("getResultsState", () => {
        const results = { list: [{}], path: "search/tools" };
        const base = {
            type: SearchCategory.TOOLS,
            isSearching: false,
            isEuropePmcSearchNoQuery: false,
        };

        it.each([
            ["no data yet", { data: undefined }, { showSkeleton: true }],
            [
                "searching without data",
                { data: undefined, isSearching: true },
                { showSkeleton: true },
            ],
            [
                "results",
                { data: results },
                { showResults: true, showSummary: true },
            ],
            [
                "searching with previous results",
                { data: results, isSearching: true },
                { showResults: true, isRefreshing: true },
            ],
            [
                "no matches",
                { data: { list: [], path: "search/tools" } },
                { showNoResults: true, showSummary: true },
            ],
            [
                "europe pmc without a query",
                { data: undefined, isEuropePmcSearchNoQuery: true },
                {},
            ],
        ])("%s", (_, params, expected) => {
            expect(getResultsState({ ...base, ...params })).toEqual({
                showResults: false,
                showSummary: false,
                isRefreshing: false,
                showSkeleton: false,
                showNoResults: false,
                ...expected,
            });
        });
    });
});
