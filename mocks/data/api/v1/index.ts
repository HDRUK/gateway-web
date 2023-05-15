import { faker } from "@faker-js/faker";

const errorResponseV1 = (status = 404) => ({
    status,
    title: faker.lorem.words(5),
    message: faker.lorem.words(10),
    errors: [
        {
            message: faker.lorem.words(5),
        },
    ],
});

export { errorResponseV1 };
