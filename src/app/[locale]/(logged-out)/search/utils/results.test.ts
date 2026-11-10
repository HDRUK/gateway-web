import { SearchCategory, ViewType } from "@/interfaces/Search";
import {
    exceedsResultLimit,
    getResultsView,
    getResultsListLayout,
    getResultsState,
    shouldHideTotal,
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

    describe("getResultsState", () => {
        const results = { list: [{}], path: "search/tools" };
        const noMatches = { list: [], path: "search/tools" };
        const base = {
            type: SearchCategory.TOOLS,
            isSearching: false,
            isEuropePmcSearchNoQuery: false,
        };

        it.each([
            ["no data yet", { data: undefined }, { showLoading: true }],
            [
                "searching without data",
                { data: undefined, isSearching: true },
                { showLoading: true },
            ],
            [
                "results",
                { data: results },
                { showResults: true, showSummary: true },
            ],
            [
                "searching with previous results",
                { data: results, isSearching: true },
                { showSummary: true, showLoading: true },
            ],
            [
                "results for another category",
                { data: { list: [{}], path: "search/datasets" } },
                {},
            ],
            [
                "no matches",
                { data: noMatches },
                { showNoResults: true, showSummary: true },
            ],
            [
                "publications with no matches and no query",
                {
                    type: SearchCategory.PUBLICATIONS,
                    data: { list: [], path: "search/publications" },
                },
                { showSummary: true },
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
                showLoading: false,
                showNoResults: false,
                ...expected,
            });
        });
    });
});
