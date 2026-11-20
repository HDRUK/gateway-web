import { JSONSchemaDocument } from "@hdruk/gwdm-view";
import { validateDocument } from "@hdruk/metadata-onboard";
import { COLLAB_SERVER_OWNED, withoutServerOwned } from "./withoutServerOwned";

// Shaped like the real HDRUK 4.1.0 schema from Traser: summary is a
// single-item allOf around a $ref (with sibling keywords), and the custodian
// sits behind a nullable anyOf.
const schema = {
    type: "object",
    required: ["version", "issued", "summary"],
    properties: {
        version: { type: "string", pattern: "^\\d+\\.\\d+\\.\\d+$" },
        issued: { type: "string", format: "date-time" },
        summary: {
            allOf: [{ $ref: "#/$defs/Summary" }],
            description: "Summary of metadata",
        },
    },
    $defs: {
        Summary: {
            type: "object",
            required: ["title", "dataCustodian"],
            properties: {
                title: { type: "string" },
                dataCustodian: {
                    anyOf: [{ $ref: "#/$defs/Custodian" }, { type: "null" }],
                },
            },
        },
        Custodian: {
            type: "object",
            required: ["identifier", "contactPoint"],
            properties: {
                identifier: { type: "string" },
                contactPoint: { type: "string", format: "email" },
                logo: { type: "string", format: "uri" },
            },
        },
    },
} as unknown as JSONSchemaDocument;

const names = (document: Record<string, unknown>, s = schema) =>
    validateDocument(s, document).map(({ name }) => name);

describe("withoutServerOwned", () => {
    it("stops requiring or checking fields the server forces on save", () => {
        const relaxed = withoutServerOwned(schema, [
            "version",
            "issued",
            "summary.dataCustodian",
        ]);
        const document = {
            summary: {
                title: "A dataset",
                dataCustodian: { contactPoint: null, logo: "not a uri" },
            },
        };

        expect(names(document)).toEqual(
            expect.arrayContaining(["version", "issued"])
        );
        expect(names(document, relaxed)).toEqual([]);
    });

    it("still checks everything the collaborator fills in", () => {
        const relaxed = withoutServerOwned(schema, COLLAB_SERVER_OWNED);

        expect(names({ summary: {} }, relaxed)).toEqual(["summary.title"]);
    });

    it("leaves the schema it was given untouched", () => {
        const before = JSON.stringify(schema);
        withoutServerOwned(schema, COLLAB_SERVER_OWNED);

        expect(JSON.stringify(schema)).toBe(before);
    });

    it("ignores paths the schema doesn't have", () => {
        expect(() =>
            withoutServerOwned(schema, ["nope.not.here", "summary.missing"])
        ).not.toThrow();
    });
});
