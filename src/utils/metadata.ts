import { Metadata } from "@/interfaces/Dataset";
import { get } from "lodash";

const getMetadataValue = (path: string, metadata?: Metadata) => {
    return get(metadata, path)
};

export { getMetadataValue };
