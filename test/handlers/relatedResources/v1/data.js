import { faker } from '@faker-js/faker';

faker.seed(5);

const generateMockRelatedObjectV1 = (data = {}) => {
    return {
        id: faker.datatype.uuid(),
        activeflag: faker.helpers.arrayElement(['active', 'review']),
        type: faker.helpers.arrayElement(['dataset', 'tool', 'dataUseRegister', 'paper', 'course', 'person']),
        authors: [parseInt(faker.random.numeric(10), 10)],
        name: faker.lorem.sentence(),
        projectTitle: faker.lorem.sentence(),
        datasetfields: { phenotypes: [] },
        categories: {},
        tags: {},
        gatewayDatasetsInfo: [],
        keywords: [],
        ...data,
    };
};

export { generateMockRelatedObjectV1 };
