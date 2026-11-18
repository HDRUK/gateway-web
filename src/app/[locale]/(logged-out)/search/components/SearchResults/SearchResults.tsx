"use client";

import { ComponentProps } from "react";
import { Button, Loading } from "@hdruk/ui";
import { Box, Typography, useTheme } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useTranslations } from "next-intl";
import {
    PartnerPortal,
    SearchCategory,
    SearchResult,
    SearchResultCollection,
    SearchResultDataCustodian,
    SearchResultDataUse,
    SearchResultDataset,
    SearchResultPublication,
    SearchResultTool,
} from "@/interfaces/Search";
import Paper from "@/components/Paper";
import useAuth from "@/hooks/useAuth";
import { useCohortStatus } from "@/hooks/useCohortStatus";
import { isAwaitingCohortDecision } from "@/consts/cohortDiscovery";
import { OpenInNewIcon } from "@/consts/icons";
import { getResultsListLayout, getResultsState } from "../../utils/results";
import DataCustodianNetwork from "../DataCustodianNetwork";
import ResultCard from "../ResultCard";
import ResultCardCollection from "../ResultCardCollection";
import ResultCardDataCustodian from "../ResultCardDataCustodian";
import ResultCardDataUse from "../ResultCardDataUse";
import ResultCardPartner from "../ResultCardPartner";
import ResultCardPublication from "../ResultCardPublication/ResultCardPublication";
import ResultCardTool from "../ResultCardTool/ResultCardTool";
import ResultsList from "../ResultsList";
import ResultsTable from "../ResultsTable";
import {
    collectionsHeader,
    externalLink,
    externalNotice,
    noResults,
    resultsSection,
} from "./SearchResults.styles";

const TRANSLATION_PATH = "pages.search";

interface SearchResultsProps {
    data?: { list: SearchResult[]; path?: string };
    type: SearchCategory;
    state: ReturnType<typeof getResultsState>;
    isExternalSourceSelected: boolean;
    showTable: boolean;
    partnerPortals: PartnerPortal[];
    networkSearchParams: ComponentProps<
        typeof DataCustodianNetwork
    >["searchParams"];
    showLibraryModal: (props: { datasetId: number }) => void;
}

const SearchResults = ({
    data,
    type,
    state,
    isExternalSourceSelected,
    showTable,
    partnerPortals,
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
        if ("portal" in result) {
            return <ResultCardPartner result={result} key={result._id} />;
        }

        const { _id: resultId } = result;

        switch (type) {
            case SearchCategory.DATASETS:
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

    return (
        <>
            {state.showLoading && <Loading label={t("loadingAriaLabel")} />}

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
            {state.showResults && isCollections && (
                <>
                    <DataCustodianNetwork searchParams={networkSearchParams} />
                    <Typography fontWeight={600} sx={collectionsHeader}>
                        {t("collectionsHeader")}
                    </Typography>
                </>
            )}
            {state.showResults && (
                <Box
                    component="section"
                    aria-describedby="result-summary"
                    aria-label="results list"
                    sx={resultsSection(theme, isCollections)}>
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
                            {data?.list.map(result => renderResultCard(result))}
                        </ResultsList>
                    )}
                    {isExternalSourceSelected &&
                        partnerPortals.map(portal => (
                            <Box sx={externalLink} key={portal.name}>
                                <Button
                                    component="a"
                                    purpose="secondary"
                                    href={portal.search_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    endIcon={
                                        <OpenInNewIcon fontSize="small" />
                                    }>
                                    {t("viewAllPartnerResults", {
                                        name: portal.name,
                                    })}
                                </Button>
                            </Box>
                        ))}
                </Box>
            )}
        </>
    );
};

export default SearchResults;
