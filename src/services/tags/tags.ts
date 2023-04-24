import config from "@/config";
import { postRequest } from "../api";

const createTag = async data => {
    return postRequest(config.tagsV1Url, data);
};

export { createTag };
