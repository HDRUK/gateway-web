import { faker } from "@faker-js/faker";
import { Filter } from "@/interfaces/Filter";

const generateFilterV1 = (data = {}): Filter => {
    return {
        created_at: faker.date
            .between("2020-01-01T00:00:00.000Z", "2020-03-01T00:00:00.000Z")
            .toISOString(),
        deleted_at: null,
        description: faker.lorem.lines(),
        enabled: faker.datatype.boolean(),
        id: faker.datatype.number(),
        type: faker.helpers.arrayElement(["features", "topics"]),
        updated_at: faker.date
            .between("2020-04-01T00:00:00.000Z", "2030-06-01T00:00:00.000Z")
            .toISOString(),

        ...data,
    };
};

const generateFiltersV1 = (length = 3, data = {}): Filter[] => {
    return Array.from({ length }).map(() => generateFilterV1(data));
};

const filterV1 = generateFilterV1();
const filtersV1 = Array.from({ length: 3 }).map(() => generateFilterV1());

export { generateFiltersV1, filtersV1, filterV1 };
