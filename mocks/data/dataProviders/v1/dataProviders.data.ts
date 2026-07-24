import { faker } from "@faker-js/faker";
import { DataProvider } from "@/interfaces/DataProvider";

const generateDataProviderV1 = (data = {}): DataProvider => {
    return {
        name: faker.company.name(),
        _id: faker.datatype.uuid(),
        ...data,
    };
};

export { generateDataProviderV1 };
