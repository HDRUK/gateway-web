import { faker } from "@faker-js/faker";
import {
    DataUse
} from "@/interfaces/DataUse";
import { generateDatasetVersionV1 } from "@/mocks/data/dataset"
import { DatasetWithTitle } from "@/interfaces/DataUse";
import { Team } from "@/interfaces/Team";

const generateDatasetWithTitleV1 = (version = "1.0", data = {}): DatasetWithTitle => {
    return {
        id: faker.datatype.number(),
        team_id: faker.datatype.number(),
        user_id: faker.datatype.number(),
        status: faker.helpers.arrayElement(["ARCHIVED", "ACTIVE", "DRAFT"]),
        create_origin: faker.helpers.arrayElement(["GMI", "API", "MANUAL"]),
        pid: faker.datatype.uuid(),
        versions: Array.from({ length: 3 }).map(() =>
            generateDatasetVersionV1(version)
        ),
        updated: faker.date.past().toString(),
        shortTitle: faker.lorem.sentence(3),
        ...data,
    };
};

const generateTeam = (): Team => {
    return {
        id: 1,
        name: faker.lorem.sentence(2),
    }

};

const generateDataUse = (data = {}): DataUse => {
    return {
        id: faker.datatype.number(),
        team_id: faker.datatype.number(),
        // user_id: faker.datatype.number(),
        status: faker.helpers.arrayElement(["ARCHIVED", "ACTIVE", "DRAFT"]),
        updated_at: faker.date.past(),
        datasets: Array.from({ length: 3 }).map(() => generateDatasetWithTitleV1("1.1")),
        team: generateTeam(),
        project_title: faker.lorem.sentence(5),
        non_gateway_applicants: Array.from({ length: 3}).map(() =>
            faker.name.fullName()
        ),
        ...data,
    };
};

export { generateDataUse };
