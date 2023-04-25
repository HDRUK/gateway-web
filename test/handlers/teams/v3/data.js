import { faker } from '@faker-js/faker';

faker.seed(5);

const generateMockTeamsMembersV3 = (data = {}) => {
    return {
        bio: faker.lorem.sentence(),
        email: faker.internet.email(),
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        organisation: faker.company.name(),
        roles: faker.helpers.arrayElements(['custodian.team.admin', 'custodian.metadata.manager', 'custodian.dar.manager']),
        userId: faker.random.numeric(16),
        id: faker.random.numeric(16),
        ...data,
    };
};

export { generateMockTeamsMembersV3 };
