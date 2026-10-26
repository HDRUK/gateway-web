import { JSONSchemaDocument } from "../types";
import { resolveSchemaNode } from "./resolveSchemaNode";

describe("resolveSchemaNode", () => {
    it("does not take a label from the $def behind a $ref", () => {
        const schema: JSONSchemaDocument = {
            $defs: {
                Text: { title: "Text", type: "string" },
            },
        };

        const resolved = resolveSchemaNode({ $ref: "#/$defs/Text" }, schema);

        expect(resolved.title).toBeUndefined();
        expect(resolved.kind).toBe("string");
    });

    it("keeps a title declared on the property itself", () => {
        const schema: JSONSchemaDocument = {
            $defs: {
                OneHundredFiftyCharacters: {
                    title: "OneHundredFiftyCharacters",
                    type: "string",
                },
            },
        };

        const resolved = resolveSchemaNode(
            {
                title: "Name of Data Custodian",
                allOf: [{ $ref: "#/$defs/OneHundredFiftyCharacters" }],
            },
            schema
        );

        expect(resolved.title).toBe("Name of Data Custodian");
    });

    it("resolves a plain scalar node", () => {
        const schema: JSONSchemaDocument = { properties: {} };
        const resolved = resolveSchemaNode(
            { type: "string", title: "Name" },
            schema
        );

        expect(resolved.kind).toBe("string");
        expect(resolved.title).toBe("Name");
        expect(resolved.nullable).toBe(false);
    });

    it("resolves a $ref against $defs", () => {
        const schema: JSONSchemaDocument = {
            $defs: {
                Coverage: {
                    type: "object",
                    title: "Coverage",
                    properties: { spatial: { type: "string" } },
                },
            },
        };

        const resolved = resolveSchemaNode(
            { $ref: "#/$defs/Coverage" },
            schema
        );

        expect(resolved.kind).toBe("object");
        expect(resolved.node.properties).toHaveProperty("spatial");
        // The $def's title names the type, so it is not borrowed as a label.
        expect(resolved.title).toBeUndefined();
    });

    it("unwraps allOf: [{ $ref }] (Pydantic's required-nested-model pattern)", () => {
        const schema: JSONSchemaDocument = {
            $defs: {
                Summary: { type: "object", title: "Summary" },
            },
        };

        const resolved = resolveSchemaNode(
            {
                allOf: [{ $ref: "#/$defs/Summary" }],
                title: "Dataset summary",
                description: "Top level",
            },
            schema
        );

        expect(resolved.kind).toBe("object");
        expect(resolved.title).toBe("Dataset summary");
        expect(resolved.description).toBe("Top level");
    });

    it("unwraps anyOf: [{...}, {type: null}] (Pydantic's Optional[X]) and marks nullable", () => {
        const schema: JSONSchemaDocument = {};
        const resolved = resolveSchemaNode(
            {
                anyOf: [{ type: "string" }, { type: "null" }],
                title: "Maybe text",
            },
            schema
        );

        expect(resolved.kind).toBe("string");
        expect(resolved.nullable).toBe(true);
        expect(resolved.title).toBe("Maybe text");
    });

    it("falls back to kind 'unknown' past the depth cap (cycle guard)", () => {
        const schema: JSONSchemaDocument = {
            $defs: {
                Self: { $ref: "#/$defs/Self" },
            },
        };

        const resolved = resolveSchemaNode({ $ref: "#/$defs/Self" }, schema);

        expect(resolved.kind).toBe("unknown");
    });

    it("returns kind 'unknown' for an undefined node", () => {
        const resolved = resolveSchemaNode(undefined, {});
        expect(resolved.kind).toBe("unknown");
    });
});
