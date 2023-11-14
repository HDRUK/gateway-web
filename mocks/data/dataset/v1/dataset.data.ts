import { faker } from "@faker-js/faker";
import { Dataset } from "@/interfaces/Dataset";

const generateDatasetV1 = (data = {}): Dataset => {
    return {
        id: faker.datatype.number(),
        status: faker.helpers.arrayElement(["Archived", "Active", "Draft"]),
        create_origin: faker.helpers.arrayElement(["FMA", "API", "MANUAL"]),
        version: faker.helpers.arrayElement(["1.0.0", "2.0.0"]),
        pid: faker.datatype.uuid(),
        label: faker.datatype.string(),
        updated: faker.date.past().toString(),
        ...data,
    };
};

const datasetV1 = generateDatasetV1();
const datasetsV1 = Array.from({ length: 3 }).map(() => generateDatasetV1());

export { generateDatasetV1, datasetsV1, datasetV1 };
