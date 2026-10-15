import { JSONSchemaDocument } from "../types";
import { resolveAtPath } from "./resolveAtPath";

// Mirrors how the real HDR UK / GWDM schemas are shaped: every property node
// is an allOf/anyOf wrapper around a $ref, never a plain object with
// `properties` on it.
const schema: JSONSchemaDocument = {
    $defs: {
        Summary: {
            type: "object",
            title: "Summary",
            properties: {
                title: { type: "string" },
                publisher: { allOf: [{ $ref: "#/$defs/Publisher" }] },
            },
        },
        Publisher: {
            type: "object",
            title: "Publisher",
            properties: {
                name: { type: "string", title: "Publisher name" },
            },
        },
    },
    properties: {
        summary: { allOf: [{ $ref: "#/$defs/Summary" }] },
        coverage: {
            anyOf: [{ type: "object", properties: {} }, { type: "null" }],
        },
    },
};

const data = {
    summary: {
        title: "A dataset",
        publisher: { name: "SAIL" },
    },
};

describe("resolveAtPath", () => {
    it("resolves a single segment through an allOf/$ref wrapper", () => {
        const result = resolveAtPath(schema, data, "summary");

        expect(result).toBeDefined();
        expect(result?.data).toEqual(data.summary);
        expect(result?.schema).toEqual(schema.properties?.summary);
    });

    it("resolves a nested segment, which plain property access cannot", () => {
        // the point of the util: schema.properties.summary.properties is
        // undefined, so this path is unreachable by hand
        expect(schema.properties?.summary?.properties).toBeUndefined();

        const result = resolveAtPath(schema, data, "summary.publisher");

        expect(result?.data).toEqual({ name: "SAIL" });
        expect(result?.schema).toEqual(
            schema.$defs?.Summary.properties?.publisher
        );
    });

    it("returns undefined for a path not in the schema", () => {
        expect(resolveAtPath(schema, data, "nope")).toBeUndefined();
        expect(resolveAtPath(schema, data, "summary.nope")).toBeUndefined();
    });

    it("returns an empty object when the schema has the path but the data does not", () => {
        const result = resolveAtPath(schema, {}, "summary.publisher");

        expect(result).toBeDefined();
        expect(result?.data).toEqual({});
    });

    it("returns the root for an empty path", () => {
        const result = resolveAtPath(schema, data, "");

        expect(result?.data).toEqual(data);
    });
});
