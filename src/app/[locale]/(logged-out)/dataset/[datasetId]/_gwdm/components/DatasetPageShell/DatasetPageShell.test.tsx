import { cookies } from "next/headers";
import { useRouter } from "next/navigation";
import { Dataset } from "@/interfaces/Dataset";
import { JSONSchemaDocument, sectionHasContent } from "@/modules/MetadataView";
import { RouteName } from "@/consts/routeName";
import { fireEvent, render, screen, within } from "@/utils/testUtils";
import {
    generateCrukGwdmDataset,
    generateHdrukGwdmDataset,
} from "@/mocks/data/dataset";
import gwdm20 from "@/mocks/data/dataset/gwdm/schemas/GWDM-2.0.json";
import gwdm21 from "@/mocks/data/dataset/gwdm/schemas/GWDM-2.1.json";
import { buildProductionSections } from "@/templates/metadata/view/production/productionLayout";
import { listMetadataTemplates } from "@/templates/metadata/view/registry";
import DatasetPageShell from "./DatasetPageShell";

jest.mock("next/navigation", () => ({
    notFound: jest.fn(),
    useSearchParams: jest.fn(),
    usePathname: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock("next/headers", () => ({ cookies: jest.fn() }));

const fixtures: {
    name: string;
    build: () => Dataset;
    schema: JSONSchemaDocument;
}[] = [
    {
        name: "HDRUK on GWDM 2.0",
        build: generateHdrukGwdmDataset,
        schema: gwdm20 as JSONSchemaDocument,
    },
    {
        name: "CRUK on GWDM 2.1",
        build: generateCrukGwdmDataset,
        schema: gwdm21 as JSONSchemaDocument,
    },
];

const templates = listMetadataTemplates();

const cases = templates.flatMap(template =>
    fixtures.map(fixture => ({
        label: `${template.source} with ${fixture.name}`,
        template,
        fixture,
    }))
);

describe("DatasetPageShell", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (cookies as jest.Mock).mockReturnValue({});
        (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    });

    it("lays the HDRUK default out exactly as the existing page", () => {
        const hdruk = templates.find(
            template => template.source === "overrides/HDRUK/default/index.mdx"
        );

        expect(hdruk?.meta.layout).toBe("production");
    });

    it("has at least an HDRUK default and a CRUK template registered", () => {
        const sources = templates.map(template => template.source);

        expect(sources).toContain("overrides/HDRUK/default/index.mdx");
        expect(sources).toContain("overrides/CRUK/default/index.mdx");
    });

    describe.each(cases)("$label", ({ template, fixture }) => {
        const setup = async () => {
            const dataset = fixture.build();
            const view = render(
                <DatasetPageShell
                    dataset={dataset}
                    schema={fixture.schema}
                    template={template}
                />
            );
            return { dataset, ...view };
        };

        it("keeps the Gateway chrome whatever the template renders", async () => {
            const { dataset } = await setup();
            const title = dataset.versions[0].metadata.metadata.summary
                .title as string;

            expect(
                screen.getByText("Back to search results")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Start a Data Access Request")
            ).toBeInTheDocument();
            expect(
                screen.getByText("Make a general enquiry")
            ).toBeInTheDocument();
            expect(screen.getByText("Add to library")).toBeInTheDocument();
            expect(screen.getAllByText(title).length).toBeGreaterThan(0);
            expect(
                screen.getByRole("link", {
                    name: dataset.versions[0].metadata.metadata.summary
                        .publisher?.name as unknown as string,
                })
            ).toHaveAttribute(
                "href",
                `/${RouteName.DATA_CUSTODIANS_ITEM}/${dataset.team.id}`
            );
            // GWDM is the internal storage model, so its version is never
            // shown as a schema version - only the submitted schema's is.
            const versions = screen
                .queryAllByText(/Schema version:/i)
                .map(label => label.closest("p")?.textContent ?? "");
            expect(versions).toEqual([
                `Schema version: ${dataset.source_schema?.version}`,
            ]);
        });

        it("links every nav entry to a section that rendered", async () => {
            const { dataset, container } = await setup();
            const data = dataset.versions[0].metadata
                .metadata as unknown as Record<string, unknown>;
            const nav = screen.getByTestId("section-nav");
            const entries = within(nav)
                .queryAllByRole("button")
                .map(button => button.textContent);

            if (template.meta.layout === "production") {
                // Production's own sections, labels and positional anchors.
                const expected = buildProductionSections(data).map(
                    section => section.title
                );
                expect(entries).toEqual(expected);
                expected.forEach((_, index) =>
                    expect(
                        container.querySelector(`#anchor${index + 1}`)
                    ).not.toBeNull()
                );
                return;
            }

            const expected = template.meta.sections.filter(name =>
                sectionHasContent(fixture.schema, data, name)
            );

            const missing = expected.filter(
                name => !container.querySelector(`#section-${name}`)
            );
            expect(missing).toEqual([]);
            expect(entries).toHaveLength(expected.length);
        });

        it("scrolls every nav entry to a section that rendered", async () => {
            await setup();
            const scrolledTo: string[] = [];
            const original = HTMLElement.prototype.scrollIntoView;
            HTMLElement.prototype.scrollIntoView = function scroll(
                this: HTMLElement
            ) {
                scrolledTo.push(this.id);
            };

            const nav = screen.getByTestId("section-nav");
            const entries = within(nav).getAllByRole("button");
            entries.forEach(entry => fireEvent.click(entry));
            HTMLElement.prototype.scrollIntoView = original;

            // One scroll per entry, each to an element that exists.
            expect(scrolledTo).toHaveLength(entries.length);
            scrolledTo.forEach(id =>
                expect(document.getElementById(id)).not.toBeNull()
            );
        });

        it("renders keywords as Gateway search buttons, like production", async () => {
            const { dataset } = await setup();
            const keywords = String(
                dataset.versions[0].metadata.metadata.summary.keywords
            )
                .split(/;,;|,/)
                .map(keyword => keyword.trim())
                .filter(Boolean);

            expect(keywords.length).toBeGreaterThan(0);
            keywords.forEach(keyword => {
                expect(
                    screen.getByRole("button", { name: keyword })
                ).toBeInTheDocument();
            });
        });

        it("renders all metadata sections on one card, like production", async () => {
            const { container } = await setup();
            const content = container.querySelector(
                `[data-template-source='${template.source}']`
            ) as HTMLElement;

            expect(
                content.querySelectorAll(":scope > .MuiPaper-root")
            ).toHaveLength(1);
            // No section draws its own card inside it.
            const card = content.querySelector(":scope > .MuiPaper-root");
            expect(
                card?.querySelectorAll(
                    "[id^='section-'] .MuiPaper-root, [id^='section-'].MuiPaper-root"
                ).length
            ).toBe(0);
        });

        it("shows the metadata format panel beneath the download button", async () => {
            const { dataset } = await setup();

            const heading = screen.getByRole("heading", {
                name: "Metadata format",
            });
            const download = screen.getByRole("button", {
                name: /Download data/,
            });

            expect(
                download.compareDocumentPosition(heading) &
                    Node.DOCUMENT_POSITION_FOLLOWING
            ).toBeTruthy();
            // The submitted (ingestion) schema, never GWDM.
            const panel = heading.parentElement as HTMLElement;
            const submitted = dataset.source_schema;
            expect(submitted).toBeTruthy();
            expect(
                within(panel).getByText("Schema:").closest("p")
            ).toHaveTextContent(submitted?.model as string);
            expect(within(panel).queryByText(/GWDM/)).not.toBeInTheDocument();
            expect(
                within(panel).getByText("Partner:").closest("p")
            ).toHaveTextContent(dataset.partner_context as string);
        });

        it("marks which template rendered the content", async () => {
            const { container } = await setup();

            expect(
                container.querySelector(
                    `[data-template-source='${template.source}']`
                )
            ).not.toBeNull();
        });
    });

    it("still renders the chrome when TRASER returned no schema", async () => {
        render(
            <DatasetPageShell
                dataset={generateHdrukGwdmDataset()}
                schema={undefined}
                template={templates[0]}
            />
        );

        expect(
            screen.getByText("Start a Data Access Request")
        ).toBeInTheDocument();
        expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("still renders a production-layout template's sections without the GWDM schema", () => {
        // Production layout labels come from the existing page's config, so a
        // TRASER outage does not hide the metadata.
        const production = templates.find(
            template => template.meta.layout === "production"
        );
        render(
            <DatasetPageShell
                dataset={generateHdrukGwdmDataset()}
                schema={undefined}
                template={production}
            />
        );

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: "Summary" })
        ).toBeInTheDocument();
    });
});
