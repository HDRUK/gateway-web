"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Box, List, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "@/interfaces/Filter";
import {
    SearchCategory,
    SearchPaginationType,
    SearchQueryParams,
    SearchResult,
    SearchResultDataUse,
    SearchResultDataset,
    SearchResultPublication,
} from "@/interfaces/Search";
import BoxContainer from "@/components/BoxContainer";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import SearchBar from "@/components/SearchBar";
import ShowingXofX from "@/components/ShowingXofX";
import Tabs from "@/components/Tabs";
import { TabVariant } from "@/components/Tabs/Tabs";
import ToggleTabs from "@/components/ToggleTabs";
import usePostSwr from "@/hooks/usePostSwr";
import useSearch from "@/hooks/useSearch";
import apis from "@/config/apis";
import {
    FILTER_DATA_SET_TITLES,
    FILTER_DATA_USE_TITLES,
    FILTER_DATE_RANGE,
    FILTER_GEOGRAPHIC_LOCATION,
    FILTER_ORGANISATION_NAME,
    FILTER_PUBLISHER_NAME,
} from "@/config/forms/filters";
import searchFormConfig, {
    QUERY_FIELD,
    SORT_FIELD,
    TYPE_FIELD,
    sortByOptionsDataUse,
    sortByOptionsDataset,
} from "@/config/forms/search";
import { colors } from "@/config/theme";
import { AppsIcon, ViewListIcon, DownloadIcon } from "@/consts/icons";
import { getAllSelectedFilters, pickOnlyFilters } from "@/utils/filters";
import FilterChips from "../FilterChips";
import FilterPanel from "../FilterPanel";
import ResultCard from "../ResultCard";
import ResultCardDataUse from "../ResultCardDataUse";
import ResultCardPublication from "../ResultCardPublication/ResultCardPublication";
import ResultsTable from "../ResultsTable";
import Sort from "../Sort";
import { ActionBar } from "./Search.styles";

const TRANSLATION_PATH = "pages.search";
const TYPE_PARAM = "type";
const FILTER_CATEGORY: { [key: string]: string } = {
    datasets: "dataset",
    dur: "dataUseRegister",
    publications: "paper",
};

enum ViewType {
    TABLE = "table",
    LIST = "list",
}

const Search = ({ filters }: { filters: Filter[] }) => {
    const [resultsView, setResultsView] = useState(ViewType.TABLE);
    const [isDownloading, setIsDownloading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations(TRANSLATION_PATH);

    const getParamString = (paramName: string) => {
        return searchParams?.get(paramName)?.toString();
    };

    const getParamArray = (paramName: string, allowEmptyStrings?: boolean) => {
        const param = searchParams?.get(paramName)?.split(",");
        return allowEmptyStrings ? param : param?.filter(filter => !!filter);
    };

    const updateQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams?.toString());
            params.set(name, value);

            return params.toString();
        },
        [searchParams]
    );

    const [queryParams, setQueryParams] = useState<SearchQueryParams>({
        query:
            getParamString(QUERY_FIELD) || searchFormConfig.defaultValues.query,
        sort: getParamString(SORT_FIELD) || searchFormConfig.defaultValues.sort,
        page: "1",
        per_page: "25",
        type:
            (getParamString(TYPE_FIELD) as SearchCategory) ||
            SearchCategory.DATASETS,
        [FILTER_DATA_USE_TITLES]: getParamArray(FILTER_DATA_USE_TITLES),
        [FILTER_PUBLISHER_NAME]: getParamArray(FILTER_PUBLISHER_NAME),
        [FILTER_GEOGRAPHIC_LOCATION]: getParamArray(FILTER_GEOGRAPHIC_LOCATION),
        [FILTER_DATE_RANGE]: getParamArray(FILTER_DATE_RANGE, true),
        [FILTER_ORGANISATION_NAME]: getParamArray(FILTER_ORGANISATION_NAME),
        [FILTER_DATA_SET_TITLES]: getParamArray(FILTER_DATA_SET_TITLES),
    });

    const { handleDownload } = useSearch(
        queryParams.type,
        resultsView,
        queryParams
    );

    useEffect(() => {
        if (
            resultsView !== ViewType.LIST &&
            queryParams.type !== SearchCategory.DATASETS
        ) {
            setResultsView(ViewType.LIST);
        }
    }, [queryParams.type, resultsView]);

    const updatePath = (key: string, value: string) => {
        router.push(`${pathname}?${updateQueryString(key, value)}`, {
            scroll: false,
        });
    };

    const onQuerySubmit = async (data: FieldValues) => {
        setQueryParams({ ...queryParams, ...data });

        updatePath(QUERY_FIELD, data.query);
    };

    const onSortChange = async (selectedValue: string) => {
        if (selectedValue === queryParams.sort) return;

        setQueryParams({
            ...queryParams,
            sort: selectedValue,
        });

        updatePath(SORT_FIELD, selectedValue);
    };

    const selectedFilters = useMemo(
        () => getAllSelectedFilters(queryParams),
        [queryParams]
    );

    const resetQueryInput = () => {
        setQueryParams({ ...queryParams, query: "" });
        updatePath(QUERY_FIELD, "");
    };

    const {
        data,
        isLoading: isSearching,
        mutate,
    } = usePostSwr<SearchPaginationType<SearchResult>>(
        `${apis.searchV1Url}/${queryParams.type}?perPage=${queryParams.per_page}&page=${queryParams.page}&sort=${queryParams.sort}`,
        {
            query: queryParams.query,
            ...pickOnlyFilters(FILTER_CATEGORY[queryParams.type], queryParams),
        },
        {
            keepPreviousData: true,
            withPagination: true,
            shouldFetch:
                queryParams.type !== SearchCategory.PUBLICATIONS ||
                !!(
                    queryParams.type === SearchCategory.PUBLICATIONS &&
                    !!queryParams.query
                ),
        }
    );

    useEffect(() => {
        mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset query param state when tab is changed
    const resetQueryParamState = (selectedType: SearchCategory) => {
        setQueryParams({
            ...queryParams,
            sort: searchFormConfig.defaultValues.sort,
            type: selectedType,
            [FILTER_DATA_USE_TITLES]: undefined,
            [FILTER_PUBLISHER_NAME]: undefined,
            [FILTER_GEOGRAPHIC_LOCATION]: undefined,
            [FILTER_DATE_RANGE]: undefined,
            [FILTER_ORGANISATION_NAME]: undefined,
            [FILTER_DATA_SET_TITLES]: undefined,
        });
    };

    const categoryTabs = [
        {
            label: t("datasets"),
            value: SearchCategory.DATASETS,
            content: "",
        },
        {
            label: t("dataUse"),
            value: SearchCategory.DATA_USE,
            content: "",
        },
        {
            label: t("collections"),
            value: SearchCategory.COLLECTIONS,
            content: "",
        },
        {
            label: t("publications"),
            value: SearchCategory.PUBLICATIONS,
            content: "",
        },
        {
            label: t("tools"),
            value: SearchCategory.TOOLS,
            content: "",
        },
    ];

    const removeFilter = (
        filterType: keyof SearchQueryParams,
        removedFilter: string
    ) => {
        const filterToUpdate = queryParams[filterType];

        if (!Array.isArray(filterToUpdate)) return;

        let filtered;

        if (filterType === FILTER_DATE_RANGE) {
            filtered = filterToUpdate.map(f => (f === removedFilter ? "" : f));
        } else {
            filtered = filterToUpdate.filter(f => f !== removedFilter);
        }

        setQueryParams({ ...queryParams, [filterType]: filtered });
        updatePath(filterType, filtered.join(","));
    };

    const toggleButtons = [
        {
            icon: AppsIcon,
            value: ViewType.TABLE,
            label: t("components.Search.toggleLabelTable"),
            onClick: () => setResultsView(ViewType.TABLE),
        },
        {
            icon: ViewListIcon,
            value: ViewType.LIST,
            label: t("components.Search.toggleLabelList"),
            onClick: () => setResultsView(ViewType.LIST),
        },
    ];

    const downloadSearchResults = async () => {
        setIsDownloading(true);
        await handleDownload();
        setIsDownloading(false);
    };

    const renderResultCard = (result: SearchResult) => {
        switch (queryParams.type) {
            case SearchCategory.DATASETS:
                return <ResultCard result={result as SearchResultDataset} />;
            case SearchCategory.PUBLICATIONS:
                return (
                    <ResultCardPublication
                        result={result as SearchResultPublication}
                    />
                );
            default:
                return (
                    <ResultCardDataUse result={result as SearchResultDataUse} />
                );
        }
    };

    const getSortOptions = () => {
        switch (queryParams.type) {
            case SearchCategory.DATA_USE:
                return sortByOptionsDataUse;
            default:
                return sortByOptionsDataset;
        }
    };

    const getExplainerText = () => {
        switch (queryParams.type) {
            case SearchCategory.PUBLICATIONS:
                return t("searchExplainerPublications");
            case SearchCategory.DATA_USE:
                return t("searchExplainerDataUse");
            case SearchCategory.COLLECTIONS:
                return t("searchExplainerCollections");
            case SearchCategory.TOOLS:
                return t("searchExplainerTools");
            default:
                return t("searchExplainerDatasets");
        }
    };

    return (
        <Box
            display={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
            }}>
            <Box
                sx={{
                    backgroundColor: "white",
                    width: "100%",
                    paddingRight: 6,
                    paddingLeft: 6,
                    display: "flex",
                    justifyContent: "center",
                }}>
                <SearchBar
                    defaultValue={queryParams.query}
                    explainerText={getExplainerText()}
                    resetAction={() => resetQueryInput()}
                    isDisabled={!queryParams.query}
                    submitAction={onQuerySubmit}
                    queryPlaceholder={t("searchPlaceholder")}
                    queryName={QUERY_FIELD}
                />
            </Box>
            <ActionBar>
                <Box sx={{ flex: 1, p: 0 }}>
                    <FilterChips
                        label={t("filtersApplied")}
                        selectedFilters={selectedFilters}
                        handleDelete={removeFilter}
                        filterCategory={FILTER_CATEGORY[queryParams.type]}
                    />
                </Box>
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ p: 0, mr: "1em" }}>
                        <Sort
                            sortName={SORT_FIELD}
                            defaultValue={queryParams.sort}
                            submitAction={onSortChange}
                            sortOptions={getSortOptions()}
                        />
                    </Box>

                    <Button
                        onClick={() =>
                            !isDownloading && downloadSearchResults()
                        }
                        variant="text"
                        startIcon={<DownloadIcon />}
                        disabled={isDownloading || !data?.list?.length}>
                        {t("downloadResults")}
                    </Button>
                </Box>
            </ActionBar>
            <Box
                sx={{
                    width: "100%",
                }}>
                <Tabs
                    centered
                    tabs={categoryTabs}
                    tabBoxSx={{
                        paddingLeft: 4,
                        paddingRight: 4,
                        borderBottom: `1px solid ${colors.green400}`,
                        marginBottom: 1,
                    }}
                    rootBoxSx={{ padding: 0 }}
                    variant={TabVariant.LARGE}
                    paramName={TYPE_PARAM}
                    persistParams={false}
                    handleChange={(_, value) =>
                        resetQueryParamState(value as SearchCategory)
                    }
                />
            </Box>
            <BoxContainer
                sx={{
                    width: "100%",
                    gridTemplateColumns: {
                        mobile: "repeat(1, 1fr)",
                        tablet: "repeat(7, 1fr)",
                    },
                    gap: {
                        mobile: 0,
                        tablet: 1,
                    },
                }}>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 2", laptop: "span 2" },
                    }}>
                    <FilterPanel
                        selectedFilters={selectedFilters}
                        filterCategory={FILTER_CATEGORY[queryParams.type]}
                        filterSourceData={filters}
                        setFilterQueryParams={(
                            filterValues: string[],
                            filterName: string
                        ) => {
                            // url requires string format, ie "one, two, three"
                            updatePath(filterName, filterValues.join(","));

                            // api requires string[] format, ie ["one", "two", "three"]
                            setQueryParams({
                                ...queryParams,
                                [filterName]: filterValues,
                            });
                        }}
                        aggregations={data?.aggregations}
                    />
                </Box>
                <Box
                    sx={{
                        gridColumn: { tablet: "span 5", laptop: "span 5" },
                    }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            m: 2,
                        }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}>
                            {data?.path?.includes(queryParams.type) && (
                                <ShowingXofX
                                    to={data?.to}
                                    from={data?.from}
                                    total={data?.total}
                                />
                            )}
                            {queryParams.type === SearchCategory.DATASETS && (
                                <ToggleTabs<ViewType>
                                    selected={resultsView}
                                    buttons={toggleButtons}
                                />
                            )}
                        </Box>

                        {isSearching && <Loading />}

                        {!isSearching && !data?.list.length && (
                            <Paper sx={{ textAlign: "center", p: 5 }}>
                                <Typography variant="h3">
                                    {t("noResults")}
                                </Typography>
                            </Paper>
                        )}
                        {!isSearching &&
                            !!data?.list.length &&
                            data?.path?.includes(queryParams.type) && (
                                <>
                                    {resultsView === ViewType.LIST && (
                                        <List
                                            sx={{
                                                width: "100%",
                                                bgcolor: "background.paper",
                                                mb: 2,
                                                pb: 2,
                                            }}>
                                            {data?.list.map(result =>
                                                renderResultCard(result)
                                            )}
                                        </List>
                                    )}
                                    {resultsView === ViewType.TABLE && (
                                        <ResultsTable
                                            results={
                                                data?.list as SearchResultDataset[]
                                            }
                                        />
                                    )}
                                    <Pagination
                                        isLoading={isSearching}
                                        page={parseInt(queryParams.page, 10)}
                                        count={data?.lastPage}
                                        onChange={(
                                            e: React.ChangeEvent<unknown>,
                                            page: number
                                        ) =>
                                            setQueryParams({
                                                ...queryParams,
                                                page: page.toString(),
                                            })
                                        }
                                    />
                                </>
                            )}
                    </Box>
                </Box>
            </BoxContainer>
        </Box>
    );
};

export default Search;
