import { get } from "lodash";
import { ReadonlyURLSearchParams } from "next/navigation";
import { Metadata } from "@/interfaces/Dataset";
import { Filter } from "@/interfaces/Filter";
import {
    SavedSearchFilterWithPivot,
    SearchQueryParams,
} from "@/interfaces/Search";
import { RouteName } from "@/consts/routeName";
import { FILTER_TYPE_MAPPING, SEARCH_CHAR_LIMIT } from "@/consts/search";
import { formatDate } from "./date";

const getDateRange = (metadata: Metadata) => {
    const endDate = get(metadata, "provenance.temporal.endDate");
    const startDate = get(metadata, "provenance.temporal.startDate");
    if (!endDate && !startDate) return "n/a";
    return `${startDate ? formatDate(startDate, "YYYY") : ""}-${
        endDate ? formatDate(endDate, "YYYY") : ""
    }`;
};

const getPopulationSize = (
    metadata: Metadata | undefined,
    notReportedLabel: string
) => {
    if (!metadata) return notReportedLabel;

    const population = get(metadata, "summary.populationSize");
    return population && typeof population === "number" && population > 0
        ? (population as number).toLocaleString()
        : notReportedLabel;
};

const getAllParams = (searchParams: ReadonlyURLSearchParams | null) => {
    const params: { [key: string]: string } = {};

    Array.from(searchParams?.entries() || []).forEach(([key, value]) => {
        params[key] = value;
    });

    return params;
};

const getFiltersFromSaveSearch = (filters: SavedSearchFilterWithPivot[]) => {
    return filters.reduce((accumulator, currentValue) => {
        const {
            keys,
            pivot: { terms },
        } = currentValue;

        return {
            ...accumulator,
            [keys]: JSON.parse(terms),
        };
    }, {});
};

const getSaveSearchFilters = (
    filters: Filter[],
    queryParams: SearchQueryParams
) => {
    const typeFilters = filters.filter(
        filter => FILTER_TYPE_MAPPING[queryParams.type] === filter.type
    );

    return typeFilters
        .map(({ id, keys }) => {
            const terms = queryParams[keys as keyof SearchQueryParams];

            return {
                id,
                terms: typeof terms === "string" ? [terms] : terms,
            };
        })
        .filter(({ terms }) => !!terms);
};

const getUrlFromSearchParams = (
    type: string,
    search_term: string,
    filters: { [key: string]: string[] },
    sort: string
) => {
    const params = new URLSearchParams();

    params.set("type", type);

    if (search_term) {
        params.set("query", search_term);
    }

    Object.keys(filters).forEach((key: string) => {
        params.set(key, filters[key].join(","));
    });

    params.set("sort", sort);

    return `/${RouteName.SEARCH}?${params.toString()}`;
};

const hasMinimumSearchCharLength = (value: string | null | undefined) => {
    return (value?.length || 0) >= SEARCH_CHAR_LIMIT;
};

export {
    getAllParams,
    getDateRange,
    getFiltersFromSaveSearch,
    getPopulationSize,
    getSaveSearchFilters,
    getUrlFromSearchParams,
    hasMinimumSearchCharLength,
};
