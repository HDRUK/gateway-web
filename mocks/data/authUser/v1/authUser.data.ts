import { faker } from "@faker-js/faker";
import { AuthUser } from "@/interfaces/AuthUser";
import { generateRoleV1 } from "../../user";

const generateAuthUserV1 = (data = {}): AuthUser => {
    return {
        id: faker.datatype.number(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        name: faker.datatype.string(),
        email: faker.internet.email(),
        secondary_email: faker.internet.email(),
        preferred_email: faker.helpers.arrayElement(["primary", "secondary"]),
        sector_id: faker.datatype.string(),
        organisation: faker.datatype.string(),
        bio: faker.datatype.string(),
        domain: faker.datatype.string(),
        provider: faker.datatype.string(),
        providerId: faker.datatype.number(),
        link: faker.datatype.string(),
        orcid: faker.datatype.string(),
        terms: faker.datatype.boolean(),
        contact_news: faker.datatype.boolean(),
        contact_feedback: faker.datatype.boolean(),
        teams: [],
        roles: Array.from({ length: 3 }).map(() => generateRoleV1()),
        ...data,
    };
};

const authUserV1 = generateAuthUserV1();

export { generateAuthUserV1, authUserV1 };
