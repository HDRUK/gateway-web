import { JSONSchemaDocument, JSONSchemaNode } from "../types";
import { resolveSchemaNode } from "./resolveSchemaNode";

export interface ResolvedPath {
    data: Record<string, unknown>;
    schema: JSONSchemaNode;
}

/**
 * Walks a dotted path through both the data and the schema at once.
 *
 * Doing this by hand is not possible beyond one level: every property node in
 * the HDR UK and GWDM schemas is an `allOf`/`anyOf` wrapper around a `$ref`, so
 * `schema.properties.summary.properties` is always undefined. Each hop here
 * resolves the node first, so nested paths like "summary.publisher" work.
 *
 * Returns undefined when the path does not exist in the schema, which the
 * caller renders as nothing.
 */
export function resolveAtPath(
    rootSchema: JSONSchemaDocument,
    data: Record<string, unknown>,
    path: string
): ResolvedPath | undefined {
    const segments = path.split(".").filter(Boolean);

    let schemaNode: JSONSchemaNode = rootSchema as JSONSchemaNode;
    let value: unknown = data;

    for (const segment of segments) {
        const properties = resolveSchemaNode(schemaNode, rootSchema).node
            .properties;
        const next = properties?.[segment];

        if (!next) return undefined;

        schemaNode = next;
        value =
            value && typeof value === "object"
                ? (value as Record<string, unknown>)[segment]
                : undefined;
    }

    return {
        schema: schemaNode,
        data: (value ?? {}) as Record<string, unknown>,
    };
}
