import { isPlainObject } from "lodash";
import { JSONSchemaDocument, JSONSchemaNode } from "../types";

export type ResolvedKind =
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "array"
    | "object"
    | "unknown";

export interface ResolvedSchemaNode {
    node: JSONSchemaNode;
    title?: string;
    description?: string;
    nullable: boolean;
    kind: ResolvedKind;
}

const MAX_DEPTH = 8;

const refName = (ref: string): string => ref.replace(/^#\/\$defs\//, "");

const kindOf = (node: JSONSchemaNode): ResolvedKind => {
    const type = Array.isArray(node.type) ? node.type[0] : node.type;

    if (
        type === "string" ||
        type === "number" ||
        type === "integer" ||
        type === "boolean" ||
        type === "array" ||
        type === "object"
    ) {
        return type;
    }
    if (node.properties) return "object";
    if (node.items) return "array";
    if (node.enum) return "string";
    return "unknown";
};

const kindOfValue = (value: unknown): ResolvedKind | undefined => {
    if (Array.isArray(value)) return "array";
    if (isPlainObject(value)) return "object";
    if (typeof value === "string") return "string";
    if (typeof value === "boolean") return "boolean";
    if (typeof value === "number") return "number";
    return undefined;
};

/**
 * A union usually offers one shape per representation - SchemaOrg's `license`
 * is `anyOf: [CreativeWork, string/uri, null]`. Taking the first branch
 * blindly resolves a plain URL to an object, so the value picks the branch
 * when it can and the first non-null branch is only the fallback.
 */
const chooseBranch = (
    branches: JSONSchemaNode[],
    rootSchema: JSONSchemaDocument,
    value: unknown,
    depth: number
): JSONSchemaNode => {
    const wanted = kindOfValue(value);
    if (!wanted) return branches[0];

    const match = branches.find(branch => {
        const kind = resolve(branch, rootSchema, undefined, depth + 1).kind;
        return kind === wanted || (wanted === "number" && kind === "integer");
    });

    return match ?? branches[0];
};

export function resolveSchemaNode(
    node: JSONSchemaNode | undefined,
    rootSchema: JSONSchemaDocument,
    /** The value being rendered, used to pick between `anyOf` branches. */
    value?: unknown
): ResolvedSchemaNode {
    return resolve(node, rootSchema, value, 0);
}

function resolve(
    node: JSONSchemaNode | undefined,
    rootSchema: JSONSchemaDocument,
    value: unknown,
    depth: number
): ResolvedSchemaNode {
    if (!node || depth > MAX_DEPTH) {
        return { node: node ?? {}, nullable: false, kind: "unknown" };
    }

    if (node.allOf && node.allOf.length > 0) {
        const resolved = resolve(node.allOf[0], rootSchema, value, depth + 1);
        return {
            ...resolved,
            title: node.title ?? resolved.title,
            description: node.description ?? resolved.description,
        };
    }

    if (node.anyOf && node.anyOf.length > 0) {
        const nonNullBranches = node.anyOf.filter(
            branch => branch.type !== "null"
        );
        const nullable = nonNullBranches.length < node.anyOf.length;
        const resolved = resolve(
            chooseBranch(nonNullBranches, rootSchema, value, depth),
            rootSchema,
            value,
            depth + 1
        );
        return {
            ...resolved,
            title: node.title ?? resolved.title,
            description: node.description ?? resolved.description,
            nullable: nullable || resolved.nullable,
        };
    }

    if (node.$ref) {
        const target = rootSchema.$defs?.[refName(node.$ref)];
        const resolved = resolve(target, rootSchema, value, depth + 1);
        return {
            ...resolved,
            // A $def names a type, not a field: "Text", "EmailAddress",
            // "OneHundredFiftyCharacters". Inheriting its title would label
            // SchemaOrg's untitled `@type` and `@context` as "Text". The
            // field's own title, or its key, is the label.
            title: node.title,
            description: node.description,
        };
    }

    return {
        node,
        title: node.title,
        description: node.description,
        nullable: false,
        kind: kindOf(node),
    };
}
