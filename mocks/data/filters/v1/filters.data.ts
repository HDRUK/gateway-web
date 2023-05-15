import { faker } from "@faker-js/faker";
import { Filter, FilterKey, FilterType } from "@/interfaces/Filter";

const generateFilterV1 = (data = {}): Filter => {
    return {
        keys: faker.helpers.arrayElement([
            "publisher",
            "phenotype",
            "researchEnvironment",
            "spatial",
            "typicalAgeRange",
            "physicalSampleAvailability",
            "followup",
            "pathway",
            "purpose",
            "source",
        ]) as FilterKey,
        enabled: faker.datatype.boolean(),
        id: faker.datatype.number(),
        value: faker.lorem.words(5),
        type: faker.helpers.arrayElement([
            "dataset",
            "collection",
            "tool",
            "course",
            "project",
            "paper",
        ]) as FilterType,
        ...data,
    };
};

const generateFiltersV1 = (length = 3, data = {}): Filter[] => {
    return Array.from({ length }).map(() => generateFilterV1(data));
};

const filterV1 = generateFilterV1();
const filtersV1 = Array.from({ length: 3 }).map(() => generateFilterV1());

export { generateFilterV1, generateFiltersV1, filtersV1, filterV1 };
