import { faker } from "@faker-js/faker";
import { Integration, FederationType, AuthType } from "@/interfaces/Integration";

const generateIntegrationV1 = (data = {}): Integration => {
    return {
        federation_type: faker.helpers.arrayElement([
             "DATASETS",
             "DUR",
            "TOOLS",
        ]) as FederationType,
        auth_type: faker.helpers.arrayElement([
            "API_KEY",
            "BEARER",
            "NO_AUTH",
        ]) as AuthType,
        created_at: faker.date
            .between("2020-01-01T00:00:00.000Z", "2020-03-01T00:00:00.000Z")
            .toISOString(),
        auth_secret_key:  faker.datatype.string(),
        endpoint_baseurl:  faker.datatype.string(),
        endpoint_datasets: faker.datatype.string(),
        endpoint_dataset:  faker.datatype.string(),
        run_time_hour: faker.datatype.number(),
        enabled: faker.datatype.boolean(),
        notification: [],
        ...data,
    };
};

const generateIntegrationsV1 = (n:number = 3): Integration[] => {
    const integrationsV1 = Array.from({ length: n }).map(() =>
        generateIntegrationV1()
    );
    return integrationsV1;
};


export { generateIntegrationsV1, generateIntegrationV1 };
