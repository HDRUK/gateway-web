import {
    JSONSchemaDocument,
    ResolvedSchemaNode,
    resolveSchemaNode,
} from "@hdruk/gwdm-view";
import { isPlainObject } from "lodash";

const coerce = (
    resolved: ResolvedSchemaNode,
    value: unknown,
    rootSchema: JSONSchemaDocument
): unknown => {
    if (resolved.kind === "number" || resolved.kind === "integer") {
        if (typeof value === "string" && value.trim() !== "") {
            const number = Number(value);
            return Number.isNaN(number) ? value : number;
        }
        return value;
    }
    if (resolved.kind === "array" && Array.isArray(value)) {
        return value.map(item =>
            coerce(
                resolveSchemaNode(resolved.node.items, rootSchema, item),
                item,
                rootSchema
            )
        );
    }
    if (resolved.kind === "object" && isPlainObject(value)) {
        const properties = resolved.node.properties ?? {};
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(
                ([key, child]) => [
                    key,
                    properties[key]
                        ? coerce(
                              resolveSchemaNode(
                                  properties[key],
                                  rootSchema,
                                  child
                              ),
                              child,
                              rootSchema
                          )
                        : child,
                ]
            )
        );
    }
    return value;
};

export const coerceNumbers = (
    rootSchema: JSONSchemaDocument,
    document: Record<string, unknown>
): Record<string, unknown> =>
    coerce(
        resolveSchemaNode(
            { type: "object", properties: rootSchema.properties },
            rootSchema
        ),
        document,
        rootSchema
    ) as Record<string, unknown>;
