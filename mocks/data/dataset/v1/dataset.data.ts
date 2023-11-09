import { faker } from "@faker-js/faker";
import { Dataset } from "@/interfaces/Dataset";

const generateDatasetV1 = (data = {}): Dataset => {
    return {
        id: faker.datatype.number(),
        status: faker.helpers.arrayElement(["Archived", "Active", "Draft"]),
        ...data,
    };
};

const datasetV1 = generateDatasetV1();
const datasetsV1 = Array.from({ length: 3 }).map(() => generateDatasetV1());

export { generateDatasetV1, datasetsV1, datasetV1 };
