import { BucketCheckbox, Filter, FilterType } from "@/interfaces/Filter";

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
                        value: `${item.keys}.filters.${bucket.key}`,
                        label: bucket.key,
                        count: bucket.doc_count,
                    };
                }),
            });
            return acc;
        }, [] as { label: string; value: string; buckets: BucketCheckbox[] }[]);
};

const transformQueryFilters = (type: string, filtersQuery?: string) => {
    if (!filtersQuery) {
        return {};
    }

    const [key, valuesString] = filtersQuery.split("=");
    if (!valuesString) {
        return {};
    }

    const filtersArray = valuesString.split(",").map(name => name.trim());
    return {
        filters: {
            [type]: { [key.trim()]: filtersArray },
        },
    };
};

const transformQueryFiltersToForm = (filtersQuery?: string) => {
    if (!filtersQuery) {
        return {};
    }

    const [, valuesString] = filtersQuery.split("=");
    if (!valuesString) {
        return {};
    }

    const filtersArray = valuesString.split(",").map(name => name.trim());

    const result: { [key: string]: boolean } = {};
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
