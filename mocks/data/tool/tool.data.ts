import { faker } from "@faker-js/faker";
import { Tool } from "@/interfaces/Tool";
import { datasetsV1 } from "@/mocks/data/dataset";
import { generateTeamV1 } from "../team";

const generateTool = (data = {}): Tool => {
    return {
        id: faker.datatype.number(),
        team_id: faker.datatype.number(),
        user_id: faker.datatype.number(),
        status: faker.helpers.arrayElement(["ARCHIVED", "ACTIVE", "DRAFT"]),
        updated_at: faker.date.past(),
        datasets: Array.from({ length: 3 }).map(() => datasetsV1),
        team: generateTeamV1(),
        project_title: faker.lorem.sentence(5),
        non_gateway_applicants: Array.from({ length: 3 }).map(() =>
            faker.name.fullName()
        ),
        non_gateway_datasets: [],
        ...data,
    };
};

const generateTools = () => Array.from({ length: 3 }).map(() => generateTool());

export { generateTool, generateTools };
