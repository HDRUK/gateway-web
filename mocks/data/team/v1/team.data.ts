import { faker } from "@faker-js/faker";
import { Team } from "@/interfaces/Team";
import { generateUserV1 } from "../../user";

const generateTeamV1 = (data = {}): Team => {
    return {
        id: faker.datatype.number().toString(),
        name: faker.datatype.string(),
        enabled: faker.datatype.boolean(),
        allows_messaging: faker.datatype.boolean(),
        workflow_enabled: faker.datatype.boolean(),
        access_requests_management: faker.datatype.boolean(),
        uses_5_safes: faker.datatype.boolean(),
        is_admin: faker.datatype.boolean(),
        member_of: faker.datatype.number(),
        contact_point: faker.internet.email(),
        application_form_updated_by: faker.date.past().toString(),
        application_form_updated_on: faker.date.past().toString(),
        users: Array.from({ length: 3 }).map(() => generateUserV1()),
        ...data,
    };
};

const teamV1 = generateTeamV1();

export { generateTeamV1, teamV1 };
