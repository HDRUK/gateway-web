import { faker } from "@faker-js/faker";
import { SearchResultDataCustodian } from "@/interfaces/Search";

const generateDataCustodianV1 = (data = {}): SearchResultDataCustodian => {
    return {
        name: faker.company.name(),
        _id: faker.datatype.uuid(),
        ...data,
    };
};

export { generateDataCustodianV1 };
