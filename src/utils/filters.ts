import { pick } from "lodash";
import {
    Bucket,
    BucketCheckbox,
    Filter,
    FilterType,
} from "@/interfaces/Filter";
import { SearchQueryParams } from "@/interfaces/Search";
import { filtersList } from "@/config/forms/filters";

const convertFilterTypesToObj = <T>(
    filterTypes: FilterType[],
    value: T
): { [key in FilterType]: T } => {
    const obj: { [key in FilterType]: T } = {} as {
        [key in FilterType]: T;
    };

    filterTypes.forEach(filterType => {
        obj[filterType] = value;
    });

    return obj;
};

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

function removeEmptyRootObjects(obj: { [key: string]: unknown }): {
    [key: string]: unknown;
} {
    const result: { [key: string]: unknown } = {};
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (Array.isArray(value)) {
            if (value.length > 0) {
                result[key] = value;
            }
        } else if (typeof value === "object" && value !== null) {
            const nestedResult = removeEmptyRootObjects(
                value as { [key: string]: unknown }
            );
            if (Object.keys(nestedResult).length !== 0) {
                result[key] = nestedResult;
            }
        } else if (value !== undefined) {
            result[key] = value;
        }
    });
    return result;
}

const transformQueryFilters = (
    type: string,
    allSearchQueries: SearchQueryParams
) => {
    const filterQueries = pick(allSearchQueries, filtersList);

    const filters = {
        [type]: filterQueries,
    };

    return removeEmptyRootObjects({
        filters,
    });
};

const transformQueryFiltersToForm = (
    filtersQuery: string | null | undefined
): { [key: string]: boolean } => {
    const result: { [key: string]: boolean } = {};
    if (!filtersQuery) {
        return result;
    }

    const filtersArray = filtersQuery.split(",").map(name => name.trim());

    filtersArray.forEach(name => {
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

export {
    removeEmptyRootObjects,
    groupByType,
    convertFilterTypesToObj,
    transformQueryFilters,
    transformQueryFiltersToForm,
    formatBucketCounts,
};
