import { useMemo } from "react";
import { SearchQueryParams } from "@/interfaces/Search";
import PublicationSearchDialog from "@/modules/PublicationSearchDialog";
import useDialog from "@/hooks/useDialog";
import { PMC_TYPE_FIELD, QUERY_FIELD } from "@/config/forms/search";
import { EUROPE_PMC_SOURCE_FIELD, STATIC_FILTER_SOURCE } from "../constants";
import { SearchParamsPatch } from "../utils/queryParams";
import {
    getPmcDatasetNames,
    isPmcDatasetSearch,
} from "../utils/searchRequest";

const usePublicationSearchDialog = (
    queryParams: SearchQueryParams,
    setSearchParams: (patch: SearchParamsPatch) => void
) => {
    const { showDialog } = useDialog();
    const isDataset = isPmcDatasetSearch(queryParams);
    const datasetNames = useMemo(
        () => getPmcDatasetNames(queryParams) ?? [],
        [queryParams]
    );

    const PublicationSearchDialogMemoised = useMemo(() => {
        return () => (
            <PublicationSearchDialog
                onSubmit={(query: string | string[], type: string) => {
                    setSearchParams({
                        [PMC_TYPE_FIELD]: type,
                        [QUERY_FIELD]: query,
                        [STATIC_FILTER_SOURCE]: EUROPE_PMC_SOURCE_FIELD,
                    });
                }}
                defaultQuery={queryParams.query}
                datasetNamesArray={datasetNames}
                isDataset={isDataset}
            />
        );
    }, [isDataset, datasetNames, queryParams.query, setSearchParams]);

    return () => showDialog(PublicationSearchDialogMemoised);
};

export default usePublicationSearchDialog;
