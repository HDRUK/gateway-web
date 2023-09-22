import { faker } from "@faker-js/faker";
import { AuthTeam } from "@/interfaces/AuthTeam";
import { generateRoleV1 } from "../../user";

const generateAuthTeamV1 = (data = {}): AuthTeam => {
    return {
        id: faker.datatype.number(),
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
        roles: Array.from({ length: 3 }).map(() => generateRoleV1()),
        ...data,
    };
};

const authTeamV1 = generateAuthTeamV1();

export { generateAuthTeamV1, authTeamV1 };
