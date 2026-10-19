import { JSONSchemaDocument, JSONSchemaNode, RenderStrategy } from "../types";
import { collectLeaves } from "./collectLeaves";
import { inferRenderStrategy } from "./inferRenderStrategy";
import { isEmptyValue } from "./isEmptyValue";
import { resolveSchemaNode, ResolvedSchemaNode } from "./resolveSchemaNode";

const ROW_STRATEGIES: RenderStrategy[] = ["objectGrid", "nestedSection"];

/**
 * Whether a value renders anything at all. An empty value does not, and
 * neither does an object rendered as rows when none of its leaves is
 * populated - so a section holding `{ origin: {} }` has nothing to show.
 */
export const valueHasContent = (
    resolved: ResolvedSchemaNode,
    value: unknown,
    rootSchema: JSONSchemaDocument
): boolean => {
    if (isEmptyValue(value)) return false;

    const strategy = inferRenderStrategy(resolved, value, rootSchema);
    if (strategy === "empty") return false;

    return (
        !ROW_STRATEGIES.includes(strategy) ||
        collectLeaves(resolved.node, value, rootSchema, 0, "", []).length > 0
    );
};

/**
 * Whether the top-level section `name` renders. The renderer and anything
 * that links to its sections, such as SectionNav, share this so a link can
 * never point at a section that rendered nothing.
 */
export const sectionHasContent = (
    schema: JSONSchemaDocument,
    data: Record<string, unknown> | undefined,
    name: string
): boolean => {
    const node: JSONSchemaNode | undefined = schema.properties?.[name];
    if (!node) return false;

    const value = data?.[name];
    if (isEmptyValue(value)) return false;

    return valueHasContent(
        resolveSchemaNode(node, schema, value),
        value,
        schema
    );
};
