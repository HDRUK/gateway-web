import { faker } from "@faker-js/faker";

const errorResponseV1 = (status: number) => ({
    code: status,
    status: faker.lorem.word().toUpperCase,
    message: faker.lorem.words(5),
    errors: [
        {
            reason: faker.lorem.word().toUpperCase,
            message: faker.lorem.words(5),
            metadata: {
                prop: faker.lorem.word(),
                value: faker.lorem.word(),
            },
        },
    ],
});

export { errorResponseV1 };
