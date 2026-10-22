"use client";

import { ComponentProps, useEffect, useMemo, useState } from "react";
import { Button } from "@hdruk/ui";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useTranslations } from "next-intl";
import { Filter } from "@/interfaces/Filter";
import {
    SearchCategory,
    SearchQueryParams,
    ViewType,
} from "@/interfaces/Search";
import { Schema } from "@/interfaces/V4Schema";
import Pagination from "@/components/Pagination";
import useGTMEvent from "@/hooks/useGTMEvent";
import { filtersList } from "@/config/forms/filters";
import { PAGE_FIELD, QUERY_FIELD, VIEW_FIELD } from "@/config/forms/search";
import { FilterAltOutlinedIcon } from "@/consts/icons";
import { ARDC_SOURCE_VALUE, FILTER_TYPE_MAPPING } from "@/consts/search";
import { cleanSearchFilters, getAllSelectedFilters } from "@/utils/filters";
import { useFeatures } from "@/providers/FeatureProvider";
import {
    DEFAULT_SORT_OPTIONS,
    SORT_OPTIONS_BY_CATEGORY,
    STATIC_FILTER_DATA_SOURCE,
} from "../../constants";
import usePublicationSearchDialog from "../../hooks/usePublicationSearchDialog";
import { useQueryParams } from "../../hooks/useQueryParams";
import useResultsView from "../../hooks/useResultsView";
import useSearchActions from "../../hooks/useSearchActions";
import useSearchResults, {
    InitialSearchResults,
} from "../../hooks/useSearchResults";
import { useStaticFilterUpdate } from "../../hooks/useStaticFilterUpdate";
import {
    getClearAllPatch,
    getFilterPatch,
    getHasSearched,
    getRemoveFilterPatch,
} from "../../utils/queryParams";
import {
    canDownloadResults,
    getFilterCount,
    getResultsState,
    showPartnerBanner,
} from "../../utils/results";
import {
    getPmcDatasetNames,
    getSearchFilters,
    isEuropePmcSearch,
    isEuropePmcSearchNoQuery,
} from "../../utils/searchRequest";
import CategoryNav from "../CategoryNav";
import FilterChips from "../FilterChips";
import FilterPanel from "../FilterPanel";
import PartnerResourcesBanner from "../PartnerResourcesBanner";
import SearchActionBar from "../SearchActionBar";
import SearchHeader from "../SearchHeader";
import SearchLayout from "../SearchLayout";
import SearchResults from "../SearchResults";
import { content, filterRow, mobileFiltersButton } from "./Search.styles";

const TRANSLATION_PATH = "pages.search";

interface SearchProps {
    filters: Filter[];
    schema: Schema;
    initialResults?: InitialSearchResults;
    initialView?: string;
    isPending?: boolean;
}

const Search = ({
    filters,
    schema,
    initialResults,
    initialView,
    isPending = false,
}: SearchProps) => {
    const { isExternalSourcesEnabled, isTypesenseSearchEnabled } =
        useFeatures();
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const {
        queryParams,
        pathname,
        searchParams,
        getParamString,
        setSearchParams,
        onQuerySubmit,
        onSortChange,
    } = useQueryParams();
    const t = useTranslations(TRANSLATION_PATH);
    const fireGTMEvent = useGTMEvent();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.only("xs"));
    const isTabletOrLaptop = useMediaQuery(
        theme.breakpoints.between("sm", "lg")
    );

    const redirectPath = searchParams
        ? `${pathname}?${searchParams.toString()}`
        : pathname;

    const forceSearch = searchParams?.get("force") !== null;
    const hasSearched = getHasSearched(searchParams);

    const { resultsView, toggleView } = useResultsView(
        queryParams.type,
        getParamString(VIEW_FIELD),
        setSearchParams,
        initialView
    );

    const {
        data,
        searchMode,
        isSearching,
        isExternalPolling,
        ardcResult,
        hdrukTotal,
    } = useSearchResults(
        queryParams,
        { isExternalSourcesEnabled, isTypesenseSearchEnabled },
        forceSearch,
        initialResults,
        isPending
    );
    const { isDatasets, dataSource, isExternalSourceSelected } = searchMode;

    const {
        isDownloading,
        downloadSearchResults,
        handleSaveClick,
        showLibraryModal,
    } = useSearchActions({
        queryParams,
        filters,
        resultsView,
        redirectPath,
        isPending,
    });

    const showEuropePmcModal = usePublicationSearchDialog(
        queryParams,
        setSearchParams
    );

    const handleUpdateStaticFilter = useStaticFilterUpdate(setSearchParams);

    useEffect(() => {
        if (isPending) {
            return;
        }
        fireGTMEvent({
            event: "search_performed",
            search_term: queryParams.query || "",
            filter_list: cleanSearchFilters(queryParams, filtersList),
        });
    }, [queryParams]);

    const selectedFilters = useMemo(
        () => getAllSelectedFilters(queryParams),
        [queryParams]
    );

    const filterCount = useMemo(
        () => getFilterCount(selectedFilters),
        [selectedFilters]
    );

    const isEuropePmcNoQuery = isEuropePmcSearchNoQuery(queryParams);
    const resultsState = getResultsState({
        data,
        type: queryParams.type,
        query: queryParams.query,
        isSearching,
        isEuropePmcSearchNoQuery: isEuropePmcNoQuery,
    });

    const displayQuery =
        getPmcDatasetNames(queryParams)?.join(",") ?? queryParams.query;

    const showTable =
        queryParams.type === SearchCategory.DATASETS &&
        resultsView === ViewType.TABLE &&
        !isMobile &&
        !isTabletOrLaptop &&
        !isExternalSourceSelected;

    const removeFilter = (
        filterType: keyof SearchQueryParams,
        removedFilter: string
    ) => {
        const patch = getRemoveFilterPatch(
            queryParams,
            filterType,
            removedFilter
        );

        if (patch) {
            setSearchParams(patch);
        }
    };

    const setFilterQueryParams = (...args: Parameters<typeof getFilterPatch>) =>
        setSearchParams(getFilterPatch(...args));

    const filterPanel = (
        <FilterPanel
            selectedFilters={selectedFilters}
            filterCategory={FILTER_TYPE_MAPPING[queryParams.type]}
            filterSourceData={filters}
            setFilterQueryParams={setFilterQueryParams}
            aggregations={data?.aggregations}
            dataSource={dataSource}
            providerCounts={{
                HDRUK: hdrukTotal ?? 0,
                ARDC: isExternalPolling ? null : ardcResult?.total ?? 0,
            }}
            updateStaticFilter={handleUpdateStaticFilter}
            getParamString={getParamString}
            showEuropePmcModal={showEuropePmcModal}
            onClearAll={() => setSearchParams(getClearAllPatch())}
            schemadefs={schema.$defs}
        />
    );

    return (
        <SearchLayout
            isMobile={isMobile}
            filterPanel={filterPanel}
            filterDrawerOpen={filterDrawerOpen}
            onFilterDrawerClose={() => setFilterDrawerOpen(false)}
            header={
                <SearchHeader
                    type={queryParams.type}
                    query={queryParams.query}
                    onSubmit={onQuerySubmit}
                    onReset={() =>
                        setSearchParams({ [QUERY_FIELD]: undefined })
                    }
                    onInputClick={
                        isEuropePmcSearch(queryParams)
                            ? showEuropePmcModal
                            : undefined
                    }
                    valueOverride={displayQuery}
                />
            }
            navigation={
                <CategoryNav
                    type={queryParams.type}
                    query={queryParams.query}
                    isMobile={isMobile}
                />
            }>
            <Box sx={content} aria-busy={isSearching}>
                <Box
                    sx={filterRow}
                    {...(!!filterCount && {
                        "aria-label": "filter controls",
                        role: "region",
                    })}>
                    {!isExternalSourceSelected && (
                        <FilterChips
                            selectedFilters={selectedFilters}
                            handleDelete={removeFilter}
                            filterCategory={
                                FILTER_TYPE_MAPPING[queryParams.type]
                            }
                        />
                    )}
                    {isMobile && (
                        <Button
                            purpose="secondary"
                            size="small"
                            onClick={() => setFilterDrawerOpen(true)}
                            startIcon={
                                <FilterAltOutlinedIcon color="secondary" />
                            }
                            sx={mobileFiltersButton}>
                            {t("filtersApplied", {
                                count: filterCount,
                            })}
                        </Button>
                    )}
                </Box>

                {!isEuropePmcNoQuery && (
                    <SearchActionBar
                        data={data}
                        isLoading={isSearching}
                        showSummary={resultsState.showSummary}
                        isCompact={isMobile || isTabletOrLaptop}
                        sort={queryParams.sort}
                        sortOptions={
                            SORT_OPTIONS_BY_CATEGORY[queryParams.type] ??
                            DEFAULT_SORT_OPTIONS
                        }
                        onSortChange={onSortChange}
                        canDownload={canDownloadResults(
                            queryParams.type,
                            isExternalSourceSelected
                        )}
                        isDownloading={isDownloading}
                        onDownload={downloadSearchResults}
                        canSave={hasSearched}
                        onSave={handleSaveClick}
                        showViewToggle={isDatasets && !isExternalSourceSelected}
                        resultsView={resultsView}
                        onToggleView={toggleView}
                    />
                )}

                <SearchResults
                    data={data}
                    type={queryParams.type}
                    query={queryParams.query}
                    isSearching={isSearching}
                    state={resultsState}
                    isExternalSourceSelected={isExternalSourceSelected}
                    showTable={showTable}
                    ardcProviderLogo={ardcResult?.provider_logo ?? undefined}
                    networkSearchParams={
                        {
                            query: queryParams.query,
                            ...getSearchFilters(queryParams),
                        } as ComponentProps<
                            typeof SearchResults
                        >["networkSearchParams"]
                    }
                    showLibraryModal={showLibraryModal}
                />

                {!isExternalSourceSelected &&
                    !resultsState.showSkeleton &&
                    !!data && (
                        <Pagination
                            isLoading={isSearching}
                            page={parseInt(queryParams.page, 10)}
                            count={data?.lastPage}
                            onChange={(
                                e: React.ChangeEvent<unknown>,
                                page: number
                            ) => setSearchParams({ [PAGE_FIELD]: `${page}` })}
                        />
                    )}

                {showPartnerBanner({
                    isDatasets,
                    isExternalSourceSelected,
                    isExternalSourcesEnabled,
                    partnerTotal: ardcResult?.total ?? 0,
                    isSearching,
                    isExternalPolling,
                }) && (
                    <PartnerResourcesBanner
                        isLoading={isSearching || isExternalPolling}
                        count={ardcResult?.total ?? 0}
                        providerLogo={ardcResult?.provider_logo ?? undefined}
                        onViewPartnerResources={() =>
                            setSearchParams({
                                [STATIC_FILTER_DATA_SOURCE]: ARDC_SOURCE_VALUE,
                            })
                        }
                    />
                )}
            </Box>
        </SearchLayout>
    );
};

export default Search;
