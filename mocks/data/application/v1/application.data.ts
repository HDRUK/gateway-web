import { faker } from "@faker-js/faker";
import { Application } from "@/interfaces/Application";

const generateApplicationV1 = (data = {}): Application => {
    return {
        id: faker.datatype.number(),
        name: faker.datatype.string(),
        app_id: faker.datatype.string(),
        client_id: faker.datatype.string(),
        image_link: faker.datatype.string(),
        team_id: faker.datatype.number(),
        user_id: faker.datatype.number(),
        description: faker.lorem.lines(),
        created_at: faker.date
            .between("2020-01-01T00:00:00.000Z", "2020-03-01T00:00:00.000Z")
            .toISOString(),
        enabled: faker.datatype.boolean(),
        updated_at: faker.date
            .between("2020-04-01T00:00:00.000Z", "2030-06-01T00:00:00.000Z")
            .toISOString(),
        permissions: [],
        ...data,
    };
};

const applicationV1 = generateApplicationV1();
const applicationsV1 = Array.from({ length: 3 }).map(() =>
    generateApplicationV1()
);

export { applicationV1, applicationsV1, generateApplicationV1 };
