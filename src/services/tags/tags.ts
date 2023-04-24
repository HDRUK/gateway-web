import config from "@/config";
import { Tag } from "@/interfaces/Tag";
import { postRequest } from "../api";

type Payload = Pick<Tag, "type">;

const createTag = async (data: Payload) => {
    return postRequest(config.tagsV1Url, data);
};

export { createTag };
