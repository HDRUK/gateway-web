import config from "@/config";
import { Filter } from "@/interfaces/Filter";
import { postRequest } from "../api";

const createFilter = async (data: Filter) => {
    return postRequest(config.filtersV1Url, data);
};

export { createFilter };
