import { startCase } from "lodash";
import { ResolvedSchemaNode } from "./resolveSchemaNode";

export const labelFor = (resolved: ResolvedSchemaNode, key: string): string =>
    resolved.title ?? startCase(key);
