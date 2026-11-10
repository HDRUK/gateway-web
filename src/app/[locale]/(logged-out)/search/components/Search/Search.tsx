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
import {
    DEFAULT_SORT_OPTIONS,
    EXCLUDED_DOWNLOAD_CATEGORIES,
    SORT_OPTIONS_BY_CATEGORY,
    STATIC_FILTER_DATA_SOURCE,
} from "../../constants";
import usePublicationSearchDialog from "../../hooks/usePublicationSearchDialog";
import { useQueryParams } from "../../hooks/useQueryParams";
import useResultsView from "../../hooks/useResultsView";
import useSearchActions from "../../hooks/useSearchActions";
import useSearchResults from "../../hooks/useSearchResults";
import { useStaticFilterUpdate } from "../../hooks/useStaticFilterUpdate";
import {
    getClearAllPatch,
    getFilterPatch,
    getHasSearched,
    getRemoveFilterPatch,
} from "../../utils/queryParams";
import { getResultsState } from "../../utils/results";
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
    initialView?: string;
}

const Search = ({ filters, schema, initialView }: SearchProps) => {
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const {
        queryParams,
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
    const isCompact = useMediaQuery(theme.breakpoints.down("lg"));

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
    } = useSearchResults(queryParams);
    const {
        isDatasets,
        dataSource,
        isExternalSourceSelected,
        externalSearchEnabled,
    } = searchMode;

    const {
        isDownloading,
        downloadSearchResults,
        handleSaveClick,
        showLibraryModal,
    } = useSearchActions({
        queryParams,
        filters,
        resultsView,
    });

    const showEuropePmcModal = usePublicationSearchDialog(
        queryParams,
        setSearchParams
    );

    const handleUpdateStaticFilter = useStaticFilterUpdate(setSearchParams);

    useEffect(() => {
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

    const filterCount = Object.values(selectedFilters).reduce<number>(
        (total, value) => total + (Array.isArray(value) ? value.length : 0),
        0
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
        !isCompact &&
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
                    <Button
                        purpose="secondary"
                        size="small"
                        onClick={() => setFilterDrawerOpen(true)}
                        startIcon={<FilterAltOutlinedIcon color="secondary" />}
                        sx={mobileFiltersButton}>
                        {t("filtersApplied", {
                            count: filterCount,
                        })}
                    </Button>
                </Box>

                {!isSearching && !isEuropePmcNoQuery && (
                    <SearchActionBar
                        data={data}
                        showSummary={resultsState.showSummary}
                        isCompact={isCompact}
                        sort={queryParams.sort}
                        sortOptions={
                            SORT_OPTIONS_BY_CATEGORY[queryParams.type] ??
                            DEFAULT_SORT_OPTIONS
                        }
                        onSortChange={onSortChange}
                        canDownload={
                            !EXCLUDED_DOWNLOAD_CATEGORIES.includes(
                                queryParams.type
                            ) && !isExternalSourceSelected
                        }
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

                {!isExternalSourceSelected && !resultsState.showLoading && (
                    <Pagination
                        page={parseInt(queryParams.page, 10)}
                        count={data?.lastPage}
                        onChange={(
                            e: React.ChangeEvent<unknown>,
                            page: number
                        ) => setSearchParams({ [PAGE_FIELD]: `${page}` })}
                    />
                )}

                {externalSearchEnabled &&
                    !isExternalSourceSelected &&
                    ((ardcResult?.total ?? 0) > 0 ||
                        isSearching ||
                        isExternalPolling) && (
                        <PartnerResourcesBanner
                            isLoading={isSearching || isExternalPolling}
                            count={ardcResult?.total ?? 0}
                            providerLogo={
                                ardcResult?.provider_logo ?? undefined
                            }
                            onViewPartnerResources={() =>
                                setSearchParams({
                                    [STATIC_FILTER_DATA_SOURCE]:
                                        ARDC_SOURCE_VALUE,
                                })
                            }
                        />
                    )}
            </Box>
        </SearchLayout>
    );
};

export default Search;
