import { JSONSchemaDocument } from "../types";
import { sectionHasContent } from "./sectionHasContent";

const schema: JSONSchemaDocument = {
    $defs: {
        Origin: {
            type: "object",
            properties: {
                purpose: { type: "string", title: "Purpose" },
                source: { type: "string", title: "Source" },
            },
        },
    },
    properties: {
        title: { type: "string", title: "Title" },
        provenance: {
            type: "object",
            title: "Provenance",
            properties: {
                origin: { $ref: "#/$defs/Origin" },
            },
        },
        keywords: { type: "array", items: { type: "string" } },
    },
};

describe("sectionHasContent", () => {
    it("is false for a missing or empty value", () => {
        expect(sectionHasContent(schema, {}, "title")).toBe(false);
        expect(sectionHasContent(schema, { title: "" }, "title")).toBe(false);
        expect(sectionHasContent(schema, { keywords: [] }, "keywords")).toBe(
            false
        );
    });

    it("is true for a populated scalar or list", () => {
        expect(sectionHasContent(schema, { title: "A title" }, "title")).toBe(
            true
        );
        expect(
            sectionHasContent(schema, { keywords: ["one"] }, "keywords")
        ).toBe(true);
    });

    it("is false for an object whose nested fields are all empty", () => {
        // A non-empty object with nothing renderable inside it renders no
        // section, so the nav must not link to it either.
        const data = { provenance: { origin: { purpose: null, source: "" } } };

        expect(sectionHasContent(schema, data, "provenance")).toBe(false);
    });

    it("is true when any nested field is populated", () => {
        const data = { provenance: { origin: { purpose: "Research" } } };

        expect(sectionHasContent(schema, data, "provenance")).toBe(true);
    });

    it("is false for a key the schema does not have", () => {
        expect(sectionHasContent(schema, { other: "x" }, "other")).toBe(false);
    });
});
