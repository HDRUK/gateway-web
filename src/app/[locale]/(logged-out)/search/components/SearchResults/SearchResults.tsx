"use client";

import { ComponentProps } from "react";
import { Button } from "@hdruk/ui";
import { Box, Typography, useTheme } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useTranslations } from "next-intl";
import {
    SearchCategory,
    SearchResult,
    SearchResultARDC,
    SearchResultCollection,
    SearchResultDataCustodian,
    SearchResultDataUse,
    SearchResultDataset,
    SearchResultPublication,
    SearchResultTool,
} from "@/interfaces/Search";
import CardStackedSkeleton from "@/components/CardStacked/CardStackedSkeleton";
import Paper from "@/components/Paper";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import { isAwaitingCohortDecision } from "@/consts/cohortDiscovery";
import { OpenInNewIcon } from "@/consts/icons";
import { SKELETON_RESULT_COUNT } from "../../constants";
import { getResultsListLayout, getResultsState } from "../../utils/results";
import { getArdcSearchUrl } from "../../utils/searchRequest";
import DataCustodianNetwork from "../DataCustodianNetwork";
import ResultCard from "../ResultCard";
import ResultCardARDC from "../ResultCardARDC";
import ResultCardCollection from "../ResultCardCollection";
import ResultCardDataCustodian from "../ResultCardDataCustodian";
import ResultCardDataUse from "../ResultCardDataUse";
import ResultCardPublication from "../ResultCardPublication/ResultCardPublication";
import ResultCardSkeleton from "../ResultCardSkeleton";
import ResultCardTool from "../ResultCardTool/ResultCardTool";
import ResultsList from "../ResultsList";
import ResultsTable from "../ResultsTable";
import {
    collectionsHeader,
    externalLink,
    externalNotice,
    noResults,
    refreshing,
    resultsSection,
    StatusLabel,
} from "./SearchResults.styles";

const TRANSLATION_PATH = "pages.search";

interface SearchResultsProps {
    data?: { list: SearchResult[]; path?: string };
    type: SearchCategory;
    query?: string;
    isSearching: boolean;
    state: ReturnType<typeof getResultsState>;
    isExternalSourceSelected: boolean;
    showTable: boolean;
    ardcProviderLogo?: string;
    networkSearchParams: ComponentProps<
        typeof DataCustodianNetwork
    >["searchParams"];
    showLibraryModal: (props: { datasetId: number }) => void;
}

const SearchResults = ({
    data,
    type,
    query,
    isSearching,
    state,
    isExternalSourceSelected,
    showTable,
    ardcProviderLogo,
    networkSearchParams,
    showLibraryModal,
}: SearchResultsProps) => {
    const t = useTranslations(TRANSLATION_PATH);
    const theme = useTheme();
    const { isLoggedIn, user } = useAuth();
    const { requestStatus, hasAccess } = useCohortStatus(user?.id);

    const isCohortDiscoveryDisabled =
        isLoggedIn && isAwaitingCohortDecision(requestStatus, hasAccess);

    const renderResultCard = (result: SearchResult) => {
        const { _id: resultId } = result;

        switch (type) {
            case SearchCategory.DATASETS:
                if (isExternalSourceSelected) {
                    const ardcItem = result as unknown as SearchResultARDC;
                    return (
                        <ResultCardARDC
                            result={ardcItem}
                            key={ardcItem.id}
                            providerLogo={ardcProviderLogo}
                        />
                    );
                }
                return (
                    <ResultCard
                        result={result as SearchResultDataset}
                        key={resultId}
                        isCohortDiscoveryDisabled={isCohortDiscoveryDisabled}
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
                        key={resultId}
                    />
                );
            case SearchCategory.DATA_CUSTODIANS:
                return (
                    <ResultCardDataCustodian
                        result={result as SearchResultDataCustodian}
                        key={resultId}
                    />
                );
            case SearchCategory.TOOLS:
                return (
                    <ResultCardTool
                        result={result as SearchResultTool}
                        key={resultId}
                    />
                );
            default:
                return (
                    <ResultCardDataUse
                        result={result as SearchResultDataUse}
                        key={resultId}
                    />
                );
        }
    };

    const isCollections = type === SearchCategory.COLLECTIONS;
    const isTiled = getResultsListLayout(type).variant === "tiled";
    const skeletonItems = Array.from(
        { length: SKELETON_RESULT_COUNT },
        (_, index) =>
            isTiled ? (
                <CardStackedSkeleton key={index} />
            ) : (
                <ResultCardSkeleton key={index} />
            )
    );

    return (
        <>
            <StatusLabel role="status">
                {isSearching ? t("loadingAriaLabel") : ""}
            </StatusLabel>

            {(state.showSkeleton || state.showResults) && isCollections && (
                <>
                    <DataCustodianNetwork searchParams={networkSearchParams} />
                    <Typography fontWeight={600} sx={collectionsHeader}>
                        {t("collectionsHeader")}
                    </Typography>
                </>
            )}
            {state.showSkeleton && (
                <Box
                    sx={resultsSection(theme, isCollections)}
                    aria-hidden
                    data-testid="search-results-skeleton">
                    {showTable ? (
                        <ResultsTable
                            results={[]}
                            showLibraryModal={showLibraryModal}
                            loading
                        />
                    ) : (
                        <ResultsList {...getResultsListLayout(type)}>
                            {skeletonItems}
                        </ResultsList>
                    )}
                </Box>
            )}

            {state.showNoResults && (
                <Paper sx={noResults} role="status" aria-live="polite">
                    <Typography
                        variant="articleLead"
                        component="p"
                        role="alert">
                        {t("noResults")}
                    </Typography>
                </Paper>
            )}
            {state.showResults && (
                    <Box
                        component="section"
                        aria-describedby="result-summary"
                        aria-label="results list"
                        sx={{
                            ...resultsSection(theme, isCollections),
                            ...(state.isRefreshing && refreshing(theme)),
                        }}>
                        <Typography variant="h2" sx={visuallyHidden}>
                            {t("components.Search.searchResults")}
                        </Typography>
                        {isExternalSourceSelected && (
                            <Box sx={externalNotice}>
                                <OpenInNewIcon fontSize="small" />
                                <Typography variant="body2">
                                    {t("partnerDatasetsNewTab")}
                                </Typography>
                            </Box>
                        )}
                        {showTable ? (
                            <ResultsTable
                                results={data?.list as SearchResultDataset[]}
                                showLibraryModal={showLibraryModal}
                            />
                        ) : (
                            <ResultsList {...getResultsListLayout(type)}>
                                {data?.list.map(result =>
                                    renderResultCard(result)
                                )}
                            </ResultsList>
                        )}
                        {isExternalSourceSelected && (
                            <Box sx={externalLink}>
                                <Button
                                    component="a"
                                    purpose="secondary"
                                    href={getArdcSearchUrl(query)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    endIcon={
                                        <OpenInNewIcon fontSize="small" />
                                    }>
                                    {t("viewAllPartnerResults")}
                                </Button>
                            </Box>
                        )}
                    </Box>
            )}
        </>
    );
};

export default SearchResults;
