import { GeneratedTemplate } from "./meta";
import { DEFAULT_PARTNER, resolveTemplate } from "./resolveTemplate";

const entry = (partner: string, version: string): GeneratedTemplate => ({
    partner,
    version,
    source: `overrides/${partner}/${version}/index.mdx`,
    Template: (() => null) as unknown as GeneratedTemplate["Template"],
    meta: { description: "", sections: [] },
});

const entries = [
    entry("HDRUK", "default"),
    entry("HDRUK", "2.2"),
    entry("CRUK", "default"),
    entry("CRUK", "2.1"),
];

const sourceFor = (partner?: string, gwdmVersion?: string | null) =>
    resolveTemplate(entries, { partner, gwdmVersion }).source;

describe("resolveTemplate", () => {
    it("defaults to HDRUK", () => {
        expect(DEFAULT_PARTNER).toBe("HDRUK");
    });

    it("prefers the partner's template for the exact GWDM version", () => {
        expect(sourceFor("CRUK", "2.1")).toBe("overrides/CRUK/2.1/index.mdx");
    });

    it("falls back to the partner's default for any other version", () => {
        expect(sourceFor("CRUK", "2.0")).toBe(
            "overrides/CRUK/default/index.mdx"
        );
    });

    it("falls back to the HDRUK template for a partner with none of its own", () => {
        expect(sourceFor("PRUK", "2.2")).toBe("overrides/HDRUK/2.2/index.mdx");
        expect(sourceFor("PRUK", "2.0")).toBe(
            "overrides/HDRUK/default/index.mdx"
        );
    });

    it("uses the HDRUK default when partner and version are unknown", () => {
        expect(sourceFor(undefined, undefined)).toBe(
            "overrides/HDRUK/default/index.mdx"
        );
        expect(sourceFor("HDRUK", null)).toBe(
            "overrides/HDRUK/default/index.mdx"
        );
    });

    it("matches the partner case-insensitively", () => {
        expect(sourceFor("cruk", "2.1")).toBe("overrides/CRUK/2.1/index.mdx");
    });

    it("throws when there is no HDRUK default to fall back on", () => {
        expect(() =>
            resolveTemplate([entry("CRUK", "default")], { partner: "PRUK" })
        ).toThrow(/HDRUK\/default/);
    });
});
