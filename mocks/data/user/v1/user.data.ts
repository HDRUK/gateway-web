import { faker } from "@faker-js/faker";
import { User } from "@/interfaces/User";

const generateUserV1 = (data = {}): User => {
    return {
        id: faker.datatype.number(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        ...data,
    };
};

const userV1 = generateUserV1();

export { generateUserV1, userV1 };
