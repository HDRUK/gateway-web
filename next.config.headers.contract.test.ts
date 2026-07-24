/**
 * @jest-environment node
 *
 * WIDGET EMBED CONTRACT
 *
 * Third-party sites embed the Gateway widget by framing /widgets/{slug}.
 * That only works because we never send framing-blocking headers
 * (X-Frame-Options or a frame-ancestors CSP). Adding one — on any route
 * pattern that could match /widgets/* — silently breaks every existing
 * embed. If a change is intentional, notify teams with active widgets
 * before release, then update these assertions.
 */

 
const nextConfig = require("./next.config");

type HeaderRule = {
    source: string;
    headers: { key: string; value: string }[];
};

describe("Widget embed contract: next.config headers", () => {
    let rules: HeaderRule[];

    beforeAll(async () => {
        rules = await nextConfig.headers();
    });

    it("never sends X-Frame-Options on any route", () => {
        rules.forEach(rule => {
            const keys = rule.headers.map(header => header.key.toLowerCase());
            expect(keys).not.toContain("x-frame-options");
        });
    });

    it("never sends a frame-ancestors CSP on any route", () => {
        rules.forEach(rule => {
            rule.headers.forEach(header => {
                if (
                    header.key.toLowerCase() === "content-security-policy" ||
                    header.key.toLowerCase() ===
                        "content-security-policy-report-only"
                ) {
                    expect(header.value).not.toMatch(/frame-ancestors/i);
                }
            });
        });
    });

    it("matches the pinned header rules", () => {
        expect(rules).toMatchSnapshot();
    });
});
