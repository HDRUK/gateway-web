import { getUserV1 } from "./user";
import {
    getFiltersV1,
    postFilterV1,
    putFilterV1,
    deleteFilterV1,
} from "./filters";

export const handlers = [
    getUserV1(),
    getFiltersV1(),
    postFilterV1(),
    putFilterV1(),
    deleteFilterV1(),
];
