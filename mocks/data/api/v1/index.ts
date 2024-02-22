import { faker } from "@faker-js/faker";

const errorResponseV1 = () => ({
    message: faker.lorem.words(10),
    errors: [
        {
            message: faker.lorem.words(5),
        },
    ],
});

export { errorResponseV1 };
