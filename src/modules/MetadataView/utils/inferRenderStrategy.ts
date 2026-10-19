import { isPlainObject } from "lodash";
import { JSONSchemaDocument, RenderStrategy } from "../types";
import { isEmptyValue } from "./isEmptyValue";
import { resolveSchemaNode, ResolvedSchemaNode } from "./resolveSchemaNode";
import { isDelimitedList } from "./splitDelimitedList";
import { tableColumnKeys } from "./tableColumnKeys";

const BLOCK_STRATEGIES: RenderStrategy[] = [
    "objectGrid",
    "nestedSection",
    "objectList",
    "objectTable",
];

/**
 * Block strategies render as a labelled block of their own; everything else is
 * a label/value pair. This is what decides heading-versus-row in a section and
 * full-width-versus-two-thirds in a field row.
 */
export const isBlockStrategy = (strategy: RenderStrategy): boolean =>
    BLOCK_STRATEGIES.includes(strategy);

const isDateFormat = (format?: string): boolean =>
    format === "date" || format === "date-time";

const isLinkFormat = (format?: string): boolean =>
    format === "uri" || format === "url";

const isEnumItems = (
    resolved: ResolvedSchemaNode,
    rootSchema: JSONSchemaDocument
): boolean => {
    const { items } = resolved.node;
    if (!items) return false;
    if (items.enum) return true;
    return !!resolveSchemaNode(items, rootSchema).node.enum;
};

const fitsInACell = (value: unknown): boolean =>
    isEmptyValue(value) ||
    (!isPlainObject(value) &&
        !(Array.isArray(value) && value.some(isPlainObject)));

/**
 * Decided from the data rather than the schema. A column schema may declare an
 * optional array of objects it rarely carries - judging on the declaration
 * alone would push every such array into accordions even when the values that
 * would need them are absent.
 */
const isTabular = (value: unknown): boolean =>
    Array.isArray(value) &&
    value.every(
        item => isPlainObject(item) && Object.values(item).every(fitsInACell)
    );

export function inferRenderStrategy(
    resolved: ResolvedSchemaNode,
    value: unknown,
    rootSchema: JSONSchemaDocument
): RenderStrategy {
    if (isEmptyValue(value)) return "empty";
    if (isDelimitedList(value)) return "tagList";

    const { node, kind } = resolved;

    if (kind === "array") {
        const firstItem = Array.isArray(value) ? value[0] : undefined;
        if (isPlainObject(firstItem)) {
            return isTabular(value) ? "objectTable" : "objectList";
        }
        return isEnumItems(resolved, rootSchema) ? "tagList" : "textList";
    }

    if (kind === "object") {
        const properties = node.properties ?? {};
        const hasNestedObject = Object.values(properties).some(prop => {
            const propResolved = resolveSchemaNode(prop, rootSchema);
            return propResolved.kind === "object";
        });
        return hasNestedObject ? "nestedSection" : "objectGrid";
    }

    if (kind === "string" && isDateFormat(node.format)) return "date";
    if (kind === "string" && isLinkFormat(node.format)) return "link";

    return "text";
}

/**
 * Whether a value renders as a labelled block rather than a single value -
 * the question behind heading-versus-row and full-width-versus-two-thirds.
 * Distinct from `isBlockStrategy` because a one-column table is handed back
 * as a list, so it occupies a row like any other value.
 */
export function rendersAsBlock(
    resolved: ResolvedSchemaNode,
    value: unknown,
    rootSchema: JSONSchemaDocument
): boolean {
    const strategy = inferRenderStrategy(resolved, value, rootSchema);

    if (!isBlockStrategy(strategy)) return false;
    if (strategy === "objectTable") {
        return tableColumnKeys(resolved, value, rootSchema).length > 1;
    }

    return true;
}
