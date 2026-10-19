import { JSONSchemaDocument } from "../types";
import { inferRenderStrategy } from "./inferRenderStrategy";
import { resolveSchemaNode } from "./resolveSchemaNode";

const emptySchema: JSONSchemaDocument = {};

describe("inferRenderStrategy", () => {
    it("returns 'empty' for empty values", () => {
        const resolved = resolveSchemaNode({ type: "string" }, emptySchema);
        expect(inferRenderStrategy(resolved, "", emptySchema)).toBe("empty");
        expect(inferRenderStrategy(resolved, [], emptySchema)).toBe("empty");
        expect(inferRenderStrategy(resolved, -1, emptySchema)).toBe("empty");
    });

    it("returns 'date' for a date-formatted string", () => {
        const resolved = resolveSchemaNode(
            { type: "string", format: "date-time" },
            emptySchema
        );
        expect(inferRenderStrategy(resolved, "2020-01-01", emptySchema)).toBe(
            "date"
        );
    });

    it("returns 'link' for a uri-formatted string", () => {
        const resolved = resolveSchemaNode(
            { type: "string", format: "uri" },
            emptySchema
        );
        expect(
            inferRenderStrategy(resolved, "https://example.com", emptySchema)
        ).toBe("link");
    });

    it("returns 'text' for a plain string", () => {
        const resolved = resolveSchemaNode({ type: "string" }, emptySchema);
        expect(inferRenderStrategy(resolved, "hello", emptySchema)).toBe(
            "text"
        );
    });

    it("returns 'objectTable' for an array of flat objects", () => {
        const resolved = resolveSchemaNode(
            { type: "array", items: { type: "object", properties: {} } },
            emptySchema
        );
        expect(
            inferRenderStrategy(
                resolved,
                [{ name: "table1", rows: 10, formats: ["CSV"] }],
                emptySchema
            )
        ).toBe("objectTable");
    });

    it("returns 'objectList' when an item carries nesting of its own", () => {
        const resolved = resolveSchemaNode(
            { type: "array", items: { type: "object", properties: {} } },
            emptySchema
        );
        expect(
            inferRenderStrategy(
                resolved,
                [{ name: "table1", columns: [{ name: "id" }] }],
                emptySchema
            )
        ).toBe("objectList");
    });

    it("ignores an empty nested value when deciding tabularity", () => {
        const resolved = resolveSchemaNode(
            { type: "array", items: { type: "object", properties: {} } },
            emptySchema
        );
        expect(
            inferRenderStrategy(
                resolved,
                [{ name: "id", values: null }],
                emptySchema
            )
        ).toBe("objectTable");
    });

    it("returns 'tagList' for a ;,; delimited string", () => {
        const resolved = resolveSchemaNode({ type: "string" }, emptySchema);
        expect(
            inferRenderStrategy(resolved, "Primary care;,;GP", emptySchema)
        ).toBe("tagList");
    });

    it("returns 'tagList' for an array of enum scalars", () => {
        const resolved = resolveSchemaNode(
            {
                type: "array",
                items: { type: "string", enum: ["a", "b"] },
            },
            emptySchema
        );
        expect(inferRenderStrategy(resolved, ["a"], emptySchema)).toBe(
            "tagList"
        );
    });

    it("returns 'textList' for an array of plain scalars", () => {
        const resolved = resolveSchemaNode(
            { type: "array", items: { type: "string" } },
            emptySchema
        );
        expect(inferRenderStrategy(resolved, ["a", "b"], emptySchema)).toBe(
            "textList"
        );
    });

    it("returns 'objectGrid' for an object whose properties are all scalar", () => {
        const schema: JSONSchemaDocument = {};
        const resolved = resolveSchemaNode(
            {
                type: "object",
                properties: { spatial: { type: "string" } },
            },
            schema
        );
        expect(inferRenderStrategy(resolved, { spatial: "UK" }, schema)).toBe(
            "objectGrid"
        );
    });

    it("returns 'nestedSection' for an object with a nested object property", () => {
        const schema: JSONSchemaDocument = {};
        const resolved = resolveSchemaNode(
            {
                type: "object",
                properties: {
                    access: { type: "object", properties: {} },
                },
            },
            schema
        );
        expect(
            inferRenderStrategy(resolved, { access: { mode: "open" } }, schema)
        ).toBe("nestedSection");
    });
});
