import { faker } from "@faker-js/faker";
import { FederationTestResponse } from "@/interfaces/Federation";
import {
    Integration,
    FederationType,
    AuthType,
} from "@/interfaces/Integration";
import { IntegrationHistory } from "@/interfaces/IntegrationHistory";

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
        last_run_at: faker.date
            .between("2020-01-01T00:00:00.000Z", "2020-03-01T00:00:00.000Z")
            .toISOString(),
        auth_secret_key: faker.datatype.string(),
        endpoint_baseurl: faker.datatype.string(),
        endpoint_datasets: faker.datatype.string(),
        endpoint_dataset: faker.datatype.string(),
        run_time_hour: faker.datatype.number(),
        enabled: faker.datatype.boolean(),
        tested: faker.datatype.boolean(),
        notifications: [],
        id: faker.datatype.number(),
        ...data,
    };
};

const generateFederationTestResponseV1 = (
    data = {}
): FederationTestResponse => {
    const success = faker.datatype.boolean();
    return {
        success,
        status: success ? 200 : 404,
        title: success ? "" : "Test failed",
        ...data,
    };
};

const generateIntegrationsV1 = (n = 3): Integration[] => {
    return Array.from({ length: n }).map(() => generateIntegrationV1());
};

const generateIntegrationHistoryV1 = (data = {}): IntegrationHistory => {
    const status = faker.helpers.arrayElement([
        "success",
        "failed",
    ]) as IntegrationHistory["status"];

    return {
        job_uuid: faker.datatype.uuid(),
        started_at: faker.date
            .between("2020-01-01T00:00:00.000Z", "2020-03-01T00:00:00.000Z")
            .toISOString(),
        finished_at: faker.date
            .between("2020-01-01T00:00:00.000Z", "2020-03-01T00:00:00.000Z")
            .toISOString(),
        status,
        message: status === "failed" ? faker.lorem.sentence() : null,
        failed_datasets:
            status === "failed"
                ? [{ pid: faker.datatype.uuid(), message: faker.lorem.sentence() }]
                : [],
        ...data,
    };
};

const generateIntegrationHistoriesV1 = (n = 3): IntegrationHistory[] => {
    return Array.from({ length: n }).map(() => generateIntegrationHistoryV1());
};

const integrationV1 = generateIntegrationV1();
const federationTestResponseV1 = generateFederationTestResponseV1();
const integrationsV1 = generateIntegrationsV1();
const integrationHistoriesV1 = generateIntegrationHistoriesV1();

export {
    generateIntegrationsV1,
    generateIntegrationV1,
    generateIntegrationHistoryV1,
    generateIntegrationHistoriesV1,
    integrationsV1,
    integrationV1,
    integrationHistoriesV1,
    federationTestResponseV1,
};
