"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter } from "@/interfaces/Filter";
import {
    SavedSearchPayload,
    SearchCategory,
    SearchPaginationType,
    SearchQueryParams,
    SearchResult,
    SearchResultCollection,
    SearchResultDataProvider,
    SearchResultDataUse,
    SearchResultDataset,
    SearchResultPublication,
    SearchResultTool,
    ViewType,
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
import ProvidersDialog from "@/modules/ProvidersDialog";
import SaveSearchDialog, {
    SaveSearchValues,
} from "@/modules/SaveSearchDialog.tsx";
import useAuth from "@/hooks/useAuth";
import useDialog from "@/hooks/useDialog";
import usePost from "@/hooks/usePost";
import usePostSwr from "@/hooks/usePostSwr";
import useSearch from "@/hooks/useSearch";
import apis from "@/config/apis";
import {
    FILTER_ACCESS_SERVICE,
    FILTER_CONTAINS_TISSUE,
    FILTER_DATA_PROVIDER,
    FILTER_DATA_SET_TITLES,
    FILTER_DATA_USE_TITLES,
    FILTER_DATE_RANGE,
    FILTER_GEOGRAPHIC_LOCATION,
    FILTER_MATERIAL_TYPE,
    FILTER_ORGANISATION_NAME,
    FILTER_POPULATION_SIZE,
    FILTER_PROGRAMMING_LANGUAGE,
    FILTER_PUBLICATION_DATE,
    FILTER_PUBLICATION_TYPE,
    FILTER_PUBLISHER_NAME,
    FILTER_SECTOR,
    FILTER_TYPE_CATEGORY,
} from "@/config/forms/filters";
import searchFormConfig, {
    QUERY_FIELD,
    SORT_FIELD,
    TYPE_FIELD,
    VIEW_FIELD,
    sortByOptionsDataUse,
    sortByOptionsDataset,
    sortByOptionsTool,
} from "@/config/forms/search";
import { colors } from "@/config/theme";
import { AppsIcon, DownloadIcon, ViewListIcon } from "@/consts/icons";
import { FILTER_TYPE_MAPPING } from "@/consts/search";
import { getAllSelectedFilters, pickOnlyFilters } from "@/utils/filters";
import { getAllParams, getSaveSearchFilters } from "@/utils/search";
import FilterChips from "../FilterChips";
import FilterPanel from "../FilterPanel";
import ResultCard from "../ResultCard";
import ResultCardCollection from "../ResultCardCollection";
import ResultCardDataProvider from "../ResultCardDataProviders";
import ResultCardDataUse from "../ResultCardDataUse";
import ResultCardPublication from "../ResultCardPublication/ResultCardPublication";
import ResultCardTool from "../ResultCardTool/ResultCardTool";
import ResultsList from "../ResultsList";
import ResultsTable from "../ResultsTable";
import Sort from "../Sort";
import { ActionBar, ResultLimitText } from "./Search.styles";

const TRANSLATION_PATH = "pages.search";
const STATIC_FILTER_SOURCE = "source";

const Search = ({ filters }: { filters: Filter[] }) => {
    const { showDialog, hideDialog } = useDialog();
    const [isDownloading, setIsDownloading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations(TRANSLATION_PATH);
    const { isLoggedIn } = useAuth();

    const getParamString = (paramName: string) => {
        return searchParams?.get(paramName)?.toString();
    };

    const getParamArray = (paramName: string, allowEmptyStrings?: boolean) => {
        const param = searchParams?.get(paramName)?.split(",");
        return allowEmptyStrings ? param : param?.filter(filter => !!filter);
    };

    const [resultsView, setResultsView] = useState(
        getParamString(VIEW_FIELD) || ViewType.TABLE
    );

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
        source:
            getParamString(STATIC_FILTER_SOURCE) ||
            searchFormConfig.defaultValues.source,
        [FILTER_DATA_USE_TITLES]: getParamArray(FILTER_DATA_USE_TITLES),
        [FILTER_PUBLISHER_NAME]: getParamArray(FILTER_PUBLISHER_NAME),
        [FILTER_GEOGRAPHIC_LOCATION]: getParamArray(FILTER_GEOGRAPHIC_LOCATION),
        [FILTER_DATE_RANGE]: getParamArray(FILTER_DATE_RANGE, true),
        [FILTER_ORGANISATION_NAME]: getParamArray(FILTER_ORGANISATION_NAME),
        [FILTER_DATA_SET_TITLES]: getParamArray(FILTER_DATA_SET_TITLES),
        [FILTER_PUBLICATION_DATE]: getParamArray(FILTER_PUBLICATION_DATE, true),
        [FILTER_PUBLICATION_TYPE]: getParamArray(FILTER_PUBLICATION_TYPE),
        [FILTER_SECTOR]: getParamArray(FILTER_SECTOR),
        [FILTER_DATA_PROVIDER]: getParamArray(FILTER_DATA_PROVIDER),
        [FILTER_ACCESS_SERVICE]: getParamArray(FILTER_ACCESS_SERVICE),
        [FILTER_POPULATION_SIZE]: getParamArray(FILTER_POPULATION_SIZE),
        [FILTER_PROGRAMMING_LANGUAGE]: getParamArray(
            FILTER_PROGRAMMING_LANGUAGE
        ),
        [FILTER_TYPE_CATEGORY]: getParamArray(FILTER_TYPE_CATEGORY),
        [FILTER_CONTAINS_TISSUE]: getParamArray(FILTER_CONTAINS_TISSUE),
        [FILTER_MATERIAL_TYPE]: getParamArray(FILTER_MATERIAL_TYPE),
    });

    const { handleDownload } = useSearch(
        queryParams.type,
        resultsView,
        queryParams
    );

    const allSearchParams = getAllParams(searchParams);

    const hasNotSearched = () => {
        const keys = Object.keys(allSearchParams).filter(
            (key: string) => allSearchParams[key] !== ""
        );
        return keys.length === 1 && keys[0] === "type";
    };

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
        `${apis.searchV1Url}/${queryParams.type}?view_type=mini&perPage=${
            queryParams.per_page
        }&page=${queryParams.page}&sort=${queryParams.sort}${
            queryParams.type === SearchCategory.PUBLICATIONS
                ? `&${STATIC_FILTER_SOURCE}=${queryParams.source}`
                : ``
        }`,
        {
            query: queryParams.query,
            ...pickOnlyFilters(
                FILTER_TYPE_MAPPING[queryParams.type],
                queryParams
            ),
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

    const saveSearchQuery = usePost<SavedSearchPayload>(apis.saveSearchesV1Url);

    useEffect(() => {
        mutate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [initialCategory, setInitialCategory] = useState<string>();
    const [initialQuery, setInitialQuery] = useState<string>();

    useEffect(() => {
        if (!initialCategory) {
            setInitialCategory(queryParams.type);
        }

        if (!initialQuery) {
            setInitialQuery(queryParams.query);
        }
    }, [initialCategory, initialQuery, queryParams.type, queryParams.query]);

    // Fire search request when publications query is entered for the first time
    useEffect(() => {
        if (initialCategory !== SearchCategory.PUBLICATIONS || initialQuery) {
            return;
        }

        if (queryParams.type !== SearchCategory.PUBLICATIONS) {
            mutate();
        } else if (!!queryParams.query && !initialQuery) {
            mutate();
        }
    }, [queryParams.query, queryParams.type, initialCategory, initialQuery]);

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
            [FILTER_PUBLICATION_DATE]: undefined,
            [FILTER_PUBLICATION_TYPE]: undefined,
            [FILTER_SECTOR]: undefined,
            [FILTER_DATA_PROVIDER]: undefined,
            [FILTER_ACCESS_SERVICE]: undefined,
            [FILTER_POPULATION_SIZE]: undefined,
            [FILTER_PROGRAMMING_LANGUAGE]: undefined,
            [FILTER_TYPE_CATEGORY]: undefined,
            [FILTER_CONTAINS_TISSUE]: undefined,
            [FILTER_MATERIAL_TYPE]: undefined,
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
            label: t("dataProviders"),
            value: SearchCategory.DATA_PROVIDERS,
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

        if (
            filterType === FILTER_DATE_RANGE ||
            filterType === FILTER_PUBLICATION_DATE
        ) {
            filtered = filterToUpdate.map(f => (f === removedFilter ? "" : f));
        } else {
            filtered = filterToUpdate.filter(f => f !== removedFilter);
        }

        setQueryParams({ ...queryParams, [filterType]: filtered });
        updatePath(filterType, filtered.join(","));
    };

    const handleChangeView = (viewType: ViewType) => {
        setResultsView(viewType);
        updatePath(VIEW_FIELD, viewType);
    };

    const toggleButtons = [
        {
            icon: AppsIcon,
            value: ViewType.TABLE,
            label: t("components.Search.toggleLabelTable"),
            onClick: () => handleChangeView(ViewType.TABLE),
        },
        {
            icon: ViewListIcon,
            value: ViewType.LIST,
            label: t("components.Search.toggleLabelList"),
            onClick: () => handleChangeView(ViewType.LIST),
        },
    ];

    const downloadSearchResults = async () => {
        setIsDownloading(true);
        await handleDownload();
        setIsDownloading(false);
    };

    const renderResultCard = (result: SearchResult) => {
        const { _id: resultId } = result;

        switch (queryParams.type) {
            case SearchCategory.DATASETS:
                return (
                    <ResultCard
                        result={result as SearchResultDataset}
                        key={resultId}
                    />
                );
            case SearchCategory.PUBLICATIONS:
                return (
                    <ResultCardPublication
                        result={result as SearchResultPublication}
                        key={resultId}
                    />
                );
            case SearchCategory.COLLECTIONS:
                return (
                    <ResultCardCollection
                        result={result as SearchResultCollection}
                    />
                );
            case SearchCategory.DATA_PROVIDERS:
                return (
                    <ResultCardDataProvider
                        imgUrl="/images/data-providers/sample.thumbnail.jpg"
                        result={result as SearchResultDataProvider}
                    />
                );
            case SearchCategory.TOOLS:
                return <ResultCardTool result={result as SearchResultTool} />;
            default:
                return (
                    <ResultCardDataUse
                        result={result as SearchResultDataUse}
                        key={resultId}
                    />
                );
        }
    };

    const renderResults = () => {
        if (resultsView === ViewType.TABLE) {
            return (
                <ResultsTable results={data?.list as SearchResultDataset[]} />
            );
        }

        return (
            <ResultsList
                variant={
                    queryParams.type === SearchCategory.COLLECTIONS ||
                    queryParams.type === SearchCategory.DATA_PROVIDERS
                        ? "tiled"
                        : "list"
                }>
                {data?.list.map(result => renderResultCard(result))}
            </ResultsList>
        );
    };

    const getSortOptions = () => {
        switch (queryParams.type) {
            case SearchCategory.DATA_USE:
                return sortByOptionsDataUse;
            case SearchCategory.TOOLS:
                return sortByOptionsTool;
            default:
                return sortByOptionsDataset;
        }
    };

    const handleSaveSubmit = ({ name }: SaveSearchValues) => {
        saveSearchQuery({
            search_term: queryParams.query || "",
            sort_order: queryParams.sort || "",
            name,
            search_endpoint: queryParams.type,
            filters: getSaveSearchFilters(filters, queryParams),
            enabled: true,
        }).then(response => {
            if (response) hideDialog();
        });
    };

    const handleSaveClick = () => {
        if (isLoggedIn) {
            showDialog(() => (
                <SaveSearchDialog
                    onSubmit={handleSaveSubmit}
                    onCancel={() => hideDialog()}
                />
            ));
        } else {
            showDialog(ProvidersDialog);
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
            case SearchCategory.DATA_PROVIDERS:
                return t("searchExplainerDataProviders");
            case SearchCategory.TOOLS:
                return t("searchExplainerTools");
            default:
                return t("searchExplainerDatasets");
        }
    };
    const showPublicationWelcomeMessage =
        !isSearching &&
        !queryParams.query &&
        queryParams.type === SearchCategory.PUBLICATIONS &&
        (!data?.list?.length || !data?.path?.includes(queryParams.type));

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
                        filterCategory={FILTER_TYPE_MAPPING[queryParams.type]}
                    />
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Box sx={{ p: 0 }}>
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
                    <Button
                        variant="outlined"
                        color="secondary"
                        disabled={hasNotSearched()}
                        onClick={handleSaveClick}>
                        Save search
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
                    paramName={TYPE_FIELD}
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
                        filterCategory={FILTER_TYPE_MAPPING[queryParams.type]}
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
                        updateStaticFilter={(
                            filterName: string,
                            value: string
                        ) => {
                            setQueryParams({
                                ...queryParams,
                                [filterName]: value,
                            });
                            updatePath(filterName, value);
                        }}
                        getParamString={getParamString}
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
                        {!isSearching && (
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}>
                                <Box sx={{ display: "flex" }}>
                                    <>
                                        {data?.path?.includes(
                                            queryParams.type
                                        ) &&
                                            !!data?.elastic_total && (
                                                <ShowingXofX
                                                    to={data?.to}
                                                    from={data?.from}
                                                    total={data?.total}
                                                />
                                            )}
                                        {data && data.elastic_total > 100 && (
                                            <ResultLimitText>
                                                {t("resultLimit")}
                                            </ResultLimitText>
                                        )}
                                    </>
                                </Box>

                                {queryParams.type ===
                                    SearchCategory.DATASETS && (
                                    <ToggleTabs<ViewType>
                                        selected={resultsView as ViewType}
                                        buttons={toggleButtons}
                                    />
                                )}
                            </Box>
                        )}

                        {showPublicationWelcomeMessage && (
                            <Paper sx={{ textAlign: "left", p: 3 }}>
                                <Typography
                                    variant="h2"
                                    style={{ fontWeight: "bolder" }}
                                    sx={{
                                        pb: 4,
                                        borderBottom: 1,
                                        borderColor: "greyCustom.light",
                                    }}>
                                    {t("publicationWelcomeHeader")}
                                </Typography>
                                <Typography variant="h3">
                                    {t.rich("publicationWelcomeText1", {
                                        // eslint-disable-next-line react/no-unstable-nested-components
                                        list: chunks => <ul>{chunks}</ul>,
                                        // eslint-disable-next-line react/no-unstable-nested-components
                                        item: chunks => <li>{chunks}</li>,
                                    })}
                                </Typography>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        pb: 3,
                                    }}>
                                    {t("publicationWelcomeText2")}
                                </Typography>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        pb: 3,
                                    }}>
                                    {t.rich("publicationWelcomeText3", {
                                        // eslint-disable-next-line react/no-unstable-nested-components
                                        link: chunks => (
                                            <a href="https://europepmc.org/">
                                                {chunks}
                                            </a>
                                        ),
                                    })}
                                </Typography>
                                <Typography variant="h3">
                                    {t.rich("publicationWelcomeText4", {
                                        // eslint-disable-next-line react/no-unstable-nested-components
                                        bold: chunks => <b>{chunks}</b>,
                                    })}
                                </Typography>
                            </Paper>
                        )}
                        {isSearching && <Loading />}

                        {!isSearching &&
                            !data?.list?.length &&
                            (queryParams.query ||
                                !(
                                    queryParams.type ===
                                    SearchCategory.PUBLICATIONS
                                )) && (
                                <Paper sx={{ textAlign: "center", p: 5 }}>
                                    <Typography variant="h3">
                                        {t("noResults")}
                                    </Typography>
                                </Paper>
                            )}
                        {!isSearching &&
                            !!data?.list?.length &&
                            data?.path?.includes(queryParams.type) && (
                                <>
                                    {renderResults()}
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
