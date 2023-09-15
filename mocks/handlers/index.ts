import { getUserV1 } from "./user";
import {
    getFiltersV1,
    postFilterV1,
    putFilterV1,
    deleteFilterV1,
} from "./filters";
import { getLogoutV1, getLogoutInternal } from "./logout";
import { getAuthInternal } from "./auth";
import { getTeamV1 } from "./teams";

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
];
