import { uniq } from "lodash";
import { JSONSchemaDocument } from "../types";
import { isEmptyValue } from "./isEmptyValue";
import { resolveSchemaNode, ResolvedSchemaNode } from "./resolveSchemaNode";

/**
 * The columns an array of objects would actually show: declared by the item
 * schema where it has properties, otherwise whatever the rows carry, minus
 * any column that is empty in every row.
 */
export const tableColumnKeys = (
    resolved: ResolvedSchemaNode,
    value: unknown,
    rootSchema: JSONSchemaDocument
): string[] => {
    const rows = (value ?? []) as Record<string, unknown>[];
    if (!rows.length) return [];

    const itemsResolved = resolveSchemaNode(resolved.node.items, rootSchema);
    const declaredKeys = Object.keys(itemsResolved.node.properties ?? {});

    return (
        declaredKeys.length
            ? declaredKeys
            : uniq(rows.flatMap(row => Object.keys(row)))
    ).filter(key => rows.some(row => !isEmptyValue(row[key])));
};
