import { unstable_serialize } from "swr";
import { SearchQueryParams } from "@/interfaces/Search";
import { getFeatures } from "@/utils/gatewayFlagAdapter";
import getSearchResults from "./getSearchResults";
import {
    getSearchMode,
    getSearchRequest,
    isEuropePmcSearch,
} from "./searchRequest";

const getInitialResults = async (
    queryParams: SearchQueryParams,
    forceSearch: boolean
) => {
    if (isEuropePmcSearch(queryParams)) {
        return undefined;
    }

    const features = await getFeatures();
    const mode = getSearchMode(queryParams, {
        isExternalSourcesEnabled: features.V2_SearchAggregation ?? false,
        isTypesenseSearchEnabled: features.TypesenseSearch ?? false,
    });
    const request = getSearchRequest(queryParams, mode, forceSearch);
    const internalRequest = getSearchRequest(
        queryParams,
        mode,
        forceSearch,
        true
    );

    if (!request || !internalRequest) {
        return undefined;
    }

    const data = await getSearchResults(internalRequest);

    return data === undefined
        ? undefined
        : { key: unstable_serialize([request.url, request.body]), data };
};

export default getInitialResults;
