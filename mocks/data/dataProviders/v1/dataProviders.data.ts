import { faker } from "@faker-js/faker";
import { DataProvider } from "@/interfaces/DataProvider";

const generateDataProviderV1 = (data = {}): DataProvider => {
    return {
        name: faker.datatype.string(),
        _id: faker.string.numeric(6),
        ...data,
    };
};

export { generateDataProviderV1 };
