import { SearchCategory, ViewType } from "@/interfaces/Search";
import { RESULT_LIMIT } from "../constants";

interface ResultTotals {
    elastic_total: number;
    total: number;
}

const exceedsResultLimit = (data?: ResultTotals) =>
    !!data && data.elastic_total > RESULT_LIMIT;

// Sometimes elastic_total > 100 while total < 100, so we avoid showing the total number
// to make it seem more consistent
const shouldHideTotal = (data?: ResultTotals) =>
    exceedsResultLimit(data) && !!data && data.total <= RESULT_LIMIT;

const isViewType = (value?: string): value is ViewType =>
    value === ViewType.LIST || value === ViewType.TABLE;

const getResultsView = (
    type: SearchCategory,
    urlView?: string,
    cookieView?: string
) => {
    if (type !== SearchCategory.DATASETS) {
        return ViewType.LIST;
    }
    if (isViewType(urlView)) {
        return urlView;
    }
    return isViewType(cookieView) ? cookieView : ViewType.TABLE;
};

const isTiledCategory = (type: SearchCategory) =>
    type === SearchCategory.COLLECTIONS ||
    type === SearchCategory.DATA_CUSTODIANS;

const getResultsListLayout = (type: SearchCategory) => ({
    variant: isTiledCategory(type) ? ("tiled" as const) : ("list" as const),
    maxDesktopColumns: type === SearchCategory.COLLECTIONS ? 4 : undefined,
    fillDanglingSingleCard: isTiledCategory(type),
});

interface ResultsStateParams {
    data?: { list?: unknown[]; path?: string };
    type: SearchCategory;
    query?: string;
    isSearching: boolean;
    isEuropePmcSearchNoQuery: boolean;
}

const getResultsState = ({
    data,
    type,
    query,
    isSearching,
    isEuropePmcSearchNoQuery,
}: ResultsStateParams) => {
    const showResults =
        !isSearching &&
        !isEuropePmcSearchNoQuery &&
        !!data?.list?.length &&
        !!data?.path?.includes(type);

    return {
        showResults,
        showSummary: !!data?.path?.includes(type),
        showLoading:
            !isEuropePmcSearchNoQuery && (isSearching || data === undefined),
        showNoResults:
            !isSearching &&
            data !== undefined &&
            !data.list?.length &&
            (!!query || type !== SearchCategory.PUBLICATIONS) &&
            !isEuropePmcSearchNoQuery,
    };
};

export {
    exceedsResultLimit,
    getResultsView,
    getResultsListLayout,
    getResultsState,
    shouldHideTotal,
};
