import { Filter, FilterType } from "@/interfaces/Filter";

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
    data: Filter[]
): { [key in FilterType]: { label: string; value: string }[] } => {
    return data.reduce((acc, item) => {
        const { type, ...rest } = item;
        acc[type] = acc[type] || [];
        acc[type].push({ value: rest.id.toString(), label: rest.value });
        return acc;
    }, {} as { [key in FilterType]: { label: string; value: string }[] });
};

export { groupByType, convertFilterTypesToObj };
