import { faker } from "@faker-js/faker";
import { Collection } from "@/interfaces/Collection";

const generateCollectionV1 = (data = {}): Collection => {
    return {
        name: faker.datatype.string(),
        ...data,
    };
};

export { generateCollectionV1 };
