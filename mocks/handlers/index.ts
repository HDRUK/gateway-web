import {
    getApplicationV1,
    getApplicationsV1,
    patchApplicationV1,
} from "./application/v1";
import { getAuthInternal } from "./auth";
import { getCMSReleaseV1 } from "./cms";
import { getCohortRequestsV1 } from "./cohortRequest";
import { getDataUses } from "./dataUses";
import { getDatasetV1, getDatasetsV1 } from "./datasets";
import {
    getFiltersV1,
    postFilterV1,
    putFilterV1,
    deleteFilterV1,
} from "./filters";
import {
    getIntegrationsV1,
    postIntegrationV1,
    postFederationsTestV1,
} from "./integration/v1";
import { getLogoutV1, getLogoutInternal } from "./logout";
import { getTeamDatasetsV1, getTeamV1 } from "./teams";
import { getUserV1 } from "./user";

export const handlers = [
    getUserV1(),
    getFiltersV1(),
    postFilterV1(),
    putFilterV1(),
    deleteFilterV1(),
    getLogoutV1(),
    getLogoutInternal(),
    getAuthInternal(),
    getTeamV1(),
    getTeamDatasetsV1(),
    getApplicationV1(),
    getApplicationsV1({}),
    patchApplicationV1(),
    getIntegrationsV1({}),
    postIntegrationV1({}),
    postFederationsTestV1({}),
    getCohortRequestsV1(),
    getCMSReleaseV1(),
    getDatasetV1(),
    getDatasetsV1(),
    getDataUses(),
];
