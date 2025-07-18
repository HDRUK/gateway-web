import {
    getApplicationV1,
    getApplicationsV1,
    patchApplicationV1,
} from "./application/v1";
import { getAuthInternal } from "./auth";
import { getCMSReleaseV1 } from "./cms";
import { getCohortRequestsV1 } from "./cohortRequest";
import { getDataUses } from "./dataUses";
import { getDatasetsV2, getDatasetV2 } from "./datasets";
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
import { getTeamV1 } from "./teams";
import { getTeamDatasetsV2 } from "./teams/v2";
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
    getTeamDatasetsV2(),
    getApplicationV1(),
    getApplicationsV1({}),
    patchApplicationV1(),
    getIntegrationsV1({}),
    postIntegrationV1({}),
    postFederationsTestV1({}),
    getCohortRequestsV1(),
    getCMSReleaseV1(),
    getDatasetV2(),
    getDatasetsV2(),
    getDataUses(),
];
