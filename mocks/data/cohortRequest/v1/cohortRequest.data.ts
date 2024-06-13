import { faker } from "@faker-js/faker";
import { CohortRequest } from "@/interfaces/CohortRequest";
import { generateUserV1 } from "@/mocks/data/user";

const generateCohortRequestV1 = (data = {}): CohortRequest => {
    return {
        id: faker.datatype.number(),
        request_status: faker.helpers.arrayElement([
            "APPROVED",
            "REJECTED",
            "PENDING",
            "BANNED",
            "SUSPENDED",
            "EXPIRED",
        ]),
        updated_at: faker.date.past().toString(),
        created_at: faker.date.past().toString(),
        user: generateUserV1(),
        ...data,
    };
};

const cohortRequestV1 = generateCohortRequestV1();
const cohortRequestsV1 = Array.from({ length: 3 }).map(() =>
    generateCohortRequestV1()
);
export { cohortRequestsV1, cohortRequestV1, generateCohortRequestV1 };
