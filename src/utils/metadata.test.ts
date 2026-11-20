import { SITE_DESCRIPTION, SITE_NAME } from "@/consts/application";
import metaData, { toMetaDescription } from "./metadata";

describe("metaData", () => {
    it("emits Open Graph and Twitter card tags", () => {
        const result = metaData({
            title: "Asthma cohort",
            description: "A cohort of asthma patients.",
        });

        expect(result.openGraph).toEqual(
            expect.objectContaining({
                title: `Asthma cohort - ${SITE_NAME}`,
                description: "A cohort of asthma patients.",
                siteName: SITE_NAME,
                type: "website",
                images: [
                    expect.objectContaining({
                        url: "/api/og?title=Asthma%20cohort",
                        width: 1200,
                        height: 630,
                    }),
                ],
            })
        );
        expect(result.twitter).toEqual(
            expect.objectContaining({
                card: "summary_large_image",
                title: `Asthma cohort - ${SITE_NAME}`,
                images: ["/api/og?title=Asthma%20cohort"],
            })
        );
    });

    it("falls back to the site description", () => {
        const result = metaData({ title: "Search", description: "" });

        expect(result.description).toBe(SITE_DESCRIPTION);
        expect(result.openGraph).toEqual(
            expect.objectContaining({ description: SITE_DESCRIPTION })
        );
    });

    it("uses an explicit image over the generated card", () => {
        const result = metaData({
            title: "Tool",
            description: "",
            image: "/images/custom.png",
        });

        expect(result.twitter).toEqual(
            expect.objectContaining({ images: ["/images/custom.png"] })
        );
    });

    it("sets canonical and og:url from url", () => {
        const result = metaData({
            title: "Tool",
            description: "",
            url: "/en/tool/1",
        });

        expect(result.alternates).toEqual({ canonical: "/en/tool/1" });
        expect(result.openGraph).toEqual(
            expect.objectContaining({ url: "/en/tool/1" })
        );
    });

    it("keeps the default title unsuffixed", () => {
        const result = metaData({
            title: SITE_NAME,
            isDefault: true,
            description: "",
        });

        expect(result.title).toBe(SITE_NAME);
    });

    it("cleans markup and entities out of titles", () => {
        const result = metaData({
            title: "<i>BRCA1</i> variants &amp; risk",
        });

        expect(result.title).toBe(`BRCA1 variants & risk - ${SITE_NAME}`);
        expect(metaData({ title: "CPRD__Aurum **linkage**" }).title).toBe(
            `CPRD__Aurum **linkage** - ${SITE_NAME}`
        );
        expect(result.twitter).toEqual(
            expect.objectContaining({
                images: ["/api/og?title=BRCA1%20variants%20%26%20risk"],
            })
        );
    });

    it("identifies the entity to the generated card", () => {
        const result = metaData({
            title: "DataLoch",
            entity: { type: "collection", id: "80" },
        });

        expect(result.twitter).toEqual(
            expect.objectContaining({
                images: ["/api/og?title=DataLoch&type=collection&id=80"],
            })
        );
    });

    it("marks articles with og:type article", () => {
        const result = metaData({ title: "Release notes", ogType: "article" });

        expect(result.openGraph).toEqual(
            expect.objectContaining({ type: "article" })
        );
    });
});

describe("toMetaDescription", () => {
    it("strips markup and collapses whitespace", () => {
        expect(
            toMetaDescription("<p>Linked   <b>records</b></p>\n<p>2020</p>")
        ).toBe("Linked records 2020");
    });

    it("reduces markdown to its text", () => {
        expect(
            toMetaDescription(
                "## About\n![Logo](https://example.com/logo.png)[DATAMIND](https://example.com/) is the **mental health** hub for CPRD__Aurum"
            )
        ).toBe("About DATAMIND is the mental health hub for CPRD__Aurum");
    });

    it("decodes HTML entities", () => {
        expect(toMetaDescription("It&#8217;s&nbsp;linked &amp; safe")).toBe(
            "It’s linked & safe"
        );
    });

    it("keeps comparison signs that are not tags", () => {
        expect(toMetaDescription("Patients aged <16 and >65")).toBe(
            "Patients aged <16 and >65"
        );
    });

    it("reads text from a rich-text editor document", () => {
        const doc = JSON.stringify({
            type: "doc",
            content: [
                {
                    type: "paragraph",
                    content: [
                        { type: "text", text: "Covers " },
                        {
                            type: "text",
                            marks: [{ type: "bold" }],
                            text: "Humber",
                        },
                        { type: "text", text: " and Yorkshire." },
                    ],
                },
                {
                    type: "bulletList",
                    content: [
                        {
                            type: "listItem",
                            content: [
                                {
                                    type: "paragraph",
                                    content: [{ type: "text", text: "North" }],
                                },
                            ],
                        },
                        {
                            type: "listItem",
                            content: [
                                {
                                    type: "paragraph",
                                    content: [{ type: "text", text: "South" }],
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "paragraph",
                    content: [
                        { type: "text", text: "Contact " },
                        {
                            type: "text",
                            marks: [{ type: "link" }],
                            text: "team@example.com",
                        },
                        { type: "text", text: "." },
                    ],
                },
            ],
        });

        expect(toMetaDescription(doc)).toBe(
            "Covers Humber and Yorkshire. North South Contact team@example.com."
        );
    });

    it("truncates at a word boundary", () => {
        const result = toMetaDescription(`${"word ".repeat(50)}end`);

        expect(result.length).toBeLessThanOrEqual(160);
        expect(result).toMatch(/word…$/);
    });

    it("handles missing text", () => {
        expect(toMetaDescription(undefined)).toBe("");
    });
});
