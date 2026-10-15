import { JSONSchemaDocument, JSONSchemaNode } from "../types";
import { isEmptyValue } from "./isEmptyValue";
import { resolveSchemaNode, ResolvedSchemaNode } from "./resolveSchemaNode";

const MAX_FLATTEN_DEPTH = 3;

export interface Leaf {
    path: string;
    resolved: ResolvedSchemaNode;
    value: unknown;
}

/**
 * Every field reads as one flat label/value row even where the schema nests
 * them, so provenance.origin.purpose shows simply as "Purpose of dataset
 * collection". This walks nested objects down to their leaves so that shape
 * falls out of the schema itself.
 */
export const collectLeaves = (
    node: JSONSchemaNode,
    value: unknown,
    rootSchema: JSONSchemaDocument,
    depth: number,
    path: string,
    acc: Leaf[]
): Leaf[] => {
    const properties = node.properties ?? {};
    const source = (value ?? {}) as Record<string, unknown>;

    Object.entries(properties).forEach(([key, propNode]) => {
        const childValue = source[key];
        if (isEmptyValue(childValue)) return;

        const resolved = resolveSchemaNode(propNode, rootSchema, childValue);

        const childPath = path ? `${path}.${key}` : key;
        const isNestedObject =
            resolved.kind === "object" &&
            Object.keys(resolved.node.properties ?? {}).length > 0;

        if (isNestedObject && depth < MAX_FLATTEN_DEPTH) {
            collectLeaves(
                resolved.node,
                childValue,
                rootSchema,
                depth + 1,
                childPath,
                acc
            );
            return;
        }

        acc.push({ path: childPath, resolved, value: childValue });
    });

    return acc;
};
