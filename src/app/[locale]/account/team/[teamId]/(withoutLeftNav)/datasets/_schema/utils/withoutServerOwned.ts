import { JSONSchemaDocument } from "@hdruk/gwdm-view";
import { cloneDeep } from "lodash";

/**
 * Fields the API forces on every collab save (DatasetCollabController) -
 * the collaborator can't see or change them, so they mustn't be validated
 * in their form. The team validates them in full when activating the draft.
 */
export const COLLAB_SERVER_OWNED = [
    "version",
    "issued",
    "modified",
    "revisions",
    "summary.dataCustodian",
];

type Node = Record<string, unknown>;

// Follows a $ref, or an allOf/anyOf/oneOf with a single non-null option (Traser
// wraps every $ref in a one-item allOf), to the node that actually holds the
// properties - within the clone, so editing it edits the shared definition.
const resolve = (root: Node, node: Node | undefined): Node | undefined => {
    if (!node) {
        return undefined;
    }
    if (typeof node.$ref === "string") {
        const target = node.$ref
            .replace(/^#\//, "")
            .split("/")
            .reduce<unknown>(
                (current, key) => (current as Node | undefined)?.[key],
                root
            );
        return resolve(root, target as Node | undefined);
    }
    const options = (
        (node.allOf ?? node.anyOf ?? node.oneOf) as Node[] | undefined
    )?.filter(option => option.type !== "null");
    return options?.length === 1 ? resolve(root, options[0]) : node;
};

/**
 * A copy of the schema in which each path is optional and accepts anything,
 * so validation and progress only cover what the collaborator fills in.
 * Paths the schema doesn't have are ignored.
 */
export const withoutServerOwned = (
    schema: JSONSchemaDocument,
    paths: string[]
): JSONSchemaDocument => {
    const root = cloneDeep(schema) as unknown as Node;

    paths.forEach(path => {
        const keys = path.split(".");
        const last = keys.pop() as string;

        let parent: Node | undefined = root;
        for (const key of keys) {
            parent = resolve(
                root,
                (parent?.properties as Node | undefined)?.[key] as
                    | Node
                    | undefined
            );
        }

        const properties = parent?.properties as Node | undefined;
        if (!parent || !properties || !(last in properties)) {
            return;
        }
        properties[last] = {};
        if (Array.isArray(parent.required)) {
            parent.required = parent.required.filter(name => name !== last);
        }
    });

    return root as unknown as JSONSchemaDocument;
};
