import { pick } from "lodash";
import { BucketCheckbox, Filter, FilterType } from "@/interfaces/Filter";
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

const transformQueryFilters = (
    type: string,
    allSearchQueries: { [key: string]: string | undefined }
) => {
    const filterQueries = pick(allSearchQueries, filtersList);
    return {
        filters: {
            [type]: filterQueries,
        },
    };
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

export {
    groupByType,
    convertFilterTypesToObj,
    transformQueryFilters,
    transformQueryFiltersToForm,
};
