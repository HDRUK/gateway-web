import { faker } from "@faker-js/faker";
import { Dataset, MauroItem } from "@/interfaces/Dataset";

const generateMauroItemV1 = (data = {}): MauroItem => {
    return {
        id: faker.datatype.uuid(),
        value: faker.datatype.string(),
        namespace: faker.datatype.string(),
        key: faker.datatype.string(),
        lastUpdated: faker.date.past().toString(),
        ...data,
    };
};

const generateDatasetV1 = (data = {}): Dataset => {
    return {
        id: faker.datatype.number(),
        status: faker.helpers.arrayElement(["ARCHIVED", "ACTIVE", "DRAFT"]),
        create_origin: faker.helpers.arrayElement(["FMA", "API", "MANUAL"]),
        version: faker.helpers.arrayElement(["1.0.0", "2.0.0"]),
        pid: faker.datatype.uuid(),
        mauro: Array.from({ length: 3 }).map(() => generateMauroItemV1()),
        label: faker.datatype.string(),
        updated: faker.date.past().toString(),
        ...data,
    };
};

const mauroV1 = generateMauroItemV1();
const datasetV1 = generateDatasetV1();
const datasetsV1 = Array.from({ length: 3 }).map(() => generateDatasetV1());

export {
    generateDatasetV1,
    datasetsV1,
    datasetV1,
    generateMauroItemV1,
    mauroV1,
};
