import { isEmpty, pick } from "lodash";
import { Bucket, BucketCheckbox, Filter } from "@/interfaces/Filter";
import { SearchQueryParams } from "@/interfaces/Search";
import {
    FILTER_COHORT_DISCOVERY,
    FILTER_CONTAINS_BIOSAMPLES,
    FILTER_MATERIAL_TYPE,
    filtersList,
} from "@/config/forms/filters";
import { INCLUDE_UNREPORTED } from "@/consts/filters";

const groupByType = (
    data: Filter[],
    type: string
): {
    label: string;
    value: string;
    buckets: BucketCheckbox[];
}[] => {
    return data
        .filter(item => item.type === type)
        .reduce((acc, item) => {
            acc.push({
                value: item.id.toString(),
                label: item.keys,
                buckets: item.buckets?.map(bucket => {
                    return {
                        value: bucket.key,
                        label: bucket.key,
                        count: bucket.doc_count,
                    };
                }),
            });
            return acc;
        }, [] as { label: string; value: string; buckets: BucketCheckbox[] }[]);
};

const getAllSelectedFilters = (
    allSearchQueries: SearchQueryParams
): { [filter: string]: string[] | undefined } => {
    return pick(allSearchQueries, filtersList) as {
        [key: string]: string[] | undefined;
    };
};

const isQueryEmpty = (filterQueries: {
    [filter: string]: string[] | undefined;
}) => {
    return (
        Object.values(filterQueries).filter(
            p =>
                p !== undefined && p.length > 0 && p.some(value => value !== "")
        ).length === 0
    );
};

const pickOnlyFilters = (type: string, allSearchQueries: SearchQueryParams) => {
    const filterQueries = pick(allSearchQueries, filtersList) as {
        [key: string]: string[] | undefined;
    };

    if (isQueryEmpty(filterQueries)) {
        return {};
    }

    const formattedFilterQueries =
        type === "dataset"
            ? {
                  ...filterQueries,
                  populationSize: {
                      from: !Number.isNaN(
                          Number(filterQueries?.populationSize?.[0])
                      )
                          ? filterQueries?.populationSize?.[0]
                          : undefined,
                      to: !Number.isNaN(
                          Number(filterQueries?.populationSize?.[1])
                      )
                          ? filterQueries?.populationSize?.[1]
                          : undefined,
                      includeUnreported:
                          !!filterQueries?.populationSize?.includes(
                              INCLUDE_UNREPORTED
                          ),
                  },
                  ...(filterQueries?.[FILTER_CONTAINS_BIOSAMPLES]?.includes(
                      FILTER_CONTAINS_BIOSAMPLES
                  )
                      ? { [FILTER_CONTAINS_BIOSAMPLES]: [true] }
                      : {}),
                  ...(filterQueries?.[FILTER_COHORT_DISCOVERY]?.includes(
                      FILTER_COHORT_DISCOVERY
                  )
                      ? { [FILTER_COHORT_DISCOVERY]: [true] }
                      : {}),
                  [FILTER_MATERIAL_TYPE]: !filterQueries?.[
                      FILTER_CONTAINS_BIOSAMPLES
                  ]?.includes(FILTER_CONTAINS_BIOSAMPLES)
                      ? []
                      : filterQueries[FILTER_MATERIAL_TYPE],
              }
            : filterQueries;

    return {
        filters: {
            [type]: formattedFilterQueries,
        },
    };
};

const transformQueryFiltersToForm = (
    filtersQuery: string[] | undefined
): { [key: string]: boolean } => {
    const result: { [key: string]: boolean } = {};
    if (!filtersQuery) {
        return result;
    }

    filtersQuery.forEach(name => {
        result[name] = true;
    });

    return result;
};

const formatBucketCounts = (buckets?: Bucket[]): { [key: string]: number } => {
    const transformedData: { [key: string]: number } = {};
    buckets?.forEach(item => {
        transformedData[item.key] = item.doc_count;
    });
    return transformedData;
};

const cleanSearchFilters = (
    input: SearchQueryParams,
    validKeys: string[]
): Record<string, string> => {
    return Object.entries(input).reduce<Record<string, string>>(
        (acc, [key, value]) => {
            if (!validKeys.includes(key)) return acc;
            if (value === false || isEmpty(value)) return acc;

            acc[key] = value;
            return acc;
        },
        {}
    );
};

export {
    formatBucketCounts,
    getAllSelectedFilters,
    groupByType,
    isQueryEmpty,
    pickOnlyFilters,
    transformQueryFiltersToForm,
    cleanSearchFilters,
};
