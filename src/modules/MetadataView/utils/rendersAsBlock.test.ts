import { JSONSchemaDocument } from "../types";
import { rendersAsBlock } from "./inferRenderStrategy";
import { resolveSchemaNode } from "./resolveSchemaNode";

const schema: JSONSchemaDocument = {
    $defs: {
        DatasetType: {
            type: "object",
            properties: {
                name: { type: "string", title: "Name" },
                subTypes: { type: "array", items: { type: "string" } },
            },
        },
    },
    properties: {
        datasetType: {
            type: "array",
            items: { $ref: "#/$defs/DatasetType" },
        },
        origin: {
            type: "object",
            properties: { purpose: { type: "string" } },
        },
    },
};

const resolve = (key: string, value: unknown) =>
    rendersAsBlock(
        resolveSchemaNode(schema.properties![key], schema, value),
        value,
        schema
    );

describe("rendersAsBlock", () => {
    it("is false for an object array that collapses to a one-column list", () => {
        expect(
            resolve("datasetType", [
                { name: "Health and disease" },
                { name: "Treatments/Interventions" },
            ])
        ).toBe(false);
    });

    it("is true once a second column carries data", () => {
        expect(
            resolve("datasetType", [
                { name: "Health and disease", subTypes: ["Cancer"] },
                { name: "Treatments/Interventions" },
            ])
        ).toBe(true);
    });

    it("is true for a nested object", () => {
        expect(resolve("origin", { purpose: "Care" })).toBe(true);
    });

    it("is false for a scalar", () => {
        expect(
            rendersAsBlock(
                resolveSchemaNode({ type: "string" }, schema),
                "Care",
                schema
            )
        ).toBe(false);
    });
});
