import { getUserV1 } from "./user";
import { getTagsV1 } from "./tags";

export const handlers = [getUserV1(), getTagsV1()];
