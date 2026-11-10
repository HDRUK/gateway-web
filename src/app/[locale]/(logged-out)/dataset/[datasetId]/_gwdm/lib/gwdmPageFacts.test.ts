import { get } from "lodash";
import {
    crocodGwdm23Metadata,
    crukGwdm21Metadata,
    generateCrocodGwdmDataset,
    generateCrukGwdmDataset,
    generateGwdmDataset,
    generateHdrukGwdmDataset,
    hdrukGwdm20Metadata,
} from "@/mocks/data/dataset";
import {
    buildGwdmPageFacts,
    GWDM_SCROLL_TARGETS,
    resolveGwdmScrollTarget,
} from "./gwdmPageFacts";

const withMetadata = (patch: Record<string, unknown>) =>
    generateGwdmDataset({
        partner: "HDRUK",
        gwdmVersion: "2.2",
        metadata: { ...hdrukGwdm20Metadata, ...patch },
    });

describe("buildGwdmPageFacts", () => {
    it("reads the title and custodian from native GWDM paths", () => {
        const facts = buildGwdmPageFacts(generateHdrukGwdmDataset());

        expect(facts.title).toBe("Example Longitudinal Cohort");
        // GWDM keeps the custodian at summary.publisher, not
        // summary.dataCustodian as HDRUK does.
        expect(facts.custodianName).toBe("Example Data Custodian");
    });

    it("takes partner and GWDM version from the API's schema block", () => {
        const hdruk = buildGwdmPageFacts(generateHdrukGwdmDataset());
        const cruk = buildGwdmPageFacts(generateCrukGwdmDataset());

        expect([hdruk.partner, hdruk.gwdmVersion]).toEqual(["HDRUK", "2.0"]);
        expect([cruk.partner, cruk.gwdmVersion]).toEqual(["CRUK", "2.1"]);
    });

    it("falls back to the envelope's gwdmVersion and HDRUK when the API omits them", () => {
        const dataset = {
            ...generateHdrukGwdmDataset(),
            schema: undefined,
            partner_context: undefined,
        };

        const facts = buildGwdmPageFacts(dataset);

        expect(facts.partner).toBe("HDRUK");
        expect(facts.gwdmVersion).toBe("2.0");
    });

    it("splits delimited dataset types and collection situations", () => {
        const facts = buildGwdmPageFacts(
            withMetadata({
                summary: {
                    ...(hdrukGwdm20Metadata.summary as object),
                    datasetType: "Health and disease;,;Registry",
                    datasetSubType: "Cancer",
                },
                provenance: {
                    origin: { collectionSituation: "COMMUNITY;,;HOSPITAL" },
                },
            })
        );

        expect(facts.datasetTypes).toEqual(["Health and disease", "Registry"]);
        expect(facts.datasetSubTypes).toEqual(["Cancer"]);
        expect(facts.collectionSituations).toEqual(["COMMUNITY", "HOSPITAL"]);
    });

    it("detects structural metadata from GWDM's flat table array", () => {
        expect(
            buildGwdmPageFacts(generateHdrukGwdmDataset()).hasStructuralMetadata
        ).toBe(true);
        expect(
            buildGwdmPageFacts(generateCrukGwdmDataset()).hasStructuralMetadata
        ).toBe(false);
    });

    it("detects a clinical trial case study from GWDM 2.3's recordType", () => {
        expect(
            buildGwdmPageFacts(generateCrocodGwdmDataset()).isCaseStudy
        ).toBe(true);
        expect(buildGwdmPageFacts(generateHdrukGwdmDataset()).isCaseStudy).toBe(
            false
        );
        expect(
            buildGwdmPageFacts(
                withMetadata({
                    required: {
                        ...(crocodGwdm23Metadata.required as object),
                        recordType: "dataset",
                    },
                    crocod: crocodGwdm23Metadata.crocod,
                })
            ).isCaseStudy
        ).toBe(false);
    });

    it("treats a case study without case study content as a dataset", () => {
        const facts = buildGwdmPageFacts(
            withMetadata({
                required: crocodGwdm23Metadata.required,
                crocod: null,
            })
        );

        expect(facts.isCaseStudy).toBe(false);
    });

    it("detects demographics only when a value is present", () => {
        expect(
            buildGwdmPageFacts(withMetadata({ demographicFrequency: null }))
                .hasDemographics
        ).toBe(false);
        expect(
            buildGwdmPageFacts(
                withMetadata({ demographicFrequency: { age: null, sex: [] } })
            ).hasDemographics
        ).toBe(true);
    });

    describe("metadata format facts", () => {
        it("passes through the schema the API says the dataset was submitted in", () => {
            const dataset = {
                ...generateCrukGwdmDataset(),
                source_schema: { model: "CRUK", version: "1.0.0" },
            };

            expect(buildGwdmPageFacts(dataset).sourceSchema).toEqual({
                model: "CRUK",
                version: "1.0.0",
            });
        });

        it("reports no source schema when the API recorded none", () => {
            const dataset = {
                ...generateCrukGwdmDataset(),
                source_schema: null,
            };

            expect(buildGwdmPageFacts(dataset).sourceSchema).toBeNull();
        });

        it("reads the record's own version and dates from GWDM's required block", () => {
            const facts = buildGwdmPageFacts(
                withMetadata({
                    required: {
                        version: "1.2.0",
                        issued: "2020-08-05T14:35:59Z",
                        modified: "2021-01-28T14:15:46Z",
                    },
                })
            );

            expect(facts.metadataVersion).toBe("1.2.0");
            expect(facts.issued).toBe("2020-08-05T14:35:59Z");
            expect(facts.modified).toBe("2021-01-28T14:15:46Z");
        });

        it("leaves facts the record does not have undefined", () => {
            const facts = buildGwdmPageFacts(withMetadata({ required: {} }));

            expect(facts.metadataVersion).toBeUndefined();
            expect(facts.issued).toBeUndefined();
            expect(facts.modified).toBeUndefined();
        });
    });

    describe("legacyVersion (for production chrome that reads HDRUK paths)", () => {
        const legacy = (patch: Record<string, unknown> = {}) =>
            buildGwdmPageFacts(withMetadata(patch)).legacyVersion;

        it("exposes the stat fields DatasetStats reads", () => {
            const version = legacy({
                summary: {
                    ...(hdrukGwdm20Metadata.summary as object),
                    populationSize: 1200,
                },
                coverage: { spatial: "United Kingdom" },
                provenance: {
                    temporal: {
                        startDate: "2010-01-01",
                        endDate: "2020-12-31",
                    },
                },
                accessibility: { access: { deliveryLeadTime: "1-2 MONTHS" } },
                tissuesSampleCollection: [
                    { materialType: "Blood" },
                    { materialType: "Blood" },
                    { materialType: "Saliva" },
                ],
            });

            const at = (path: string) =>
                get(version, `metadata.metadata.${path}`);

            expect(at("summary.populationSize")).toBe(1200);
            expect(at("coverage.spatial")).toBe("United Kingdom");
            expect(at("provenance.temporal.startDate")).toBe("2010-01-01");
            expect(at("provenance.temporal.endDate")).toBe("2020-12-31");
            expect(at("accessibility.access.deliveryLeadTime")).toBe(
                "1-2 MONTHS"
            );
            // GWDM records material type per sample collection.
            expect(at("coverage.materialType")).toEqual(["Blood", "Saliva"]);
        });

        it("maps the custodian onto summary.dataCustodian.name", () => {
            expect(
                get(legacy(), "metadata.metadata.summary.dataCustodian.name")
            ).toBe("Example Data Custodian");
        });

        it("always provides structuralMetadata.tables and syntheticDataWebLink as arrays", () => {
            // DatasetMindMap indexes syntheticDataWebLink[0] unguarded, and
            // ActionBar reads tables.length.
            const cruk = buildGwdmPageFacts(generateCrukGwdmDataset())
                .legacyVersion.metadata.metadata;
            expect(cruk.structuralMetadata).toEqual({
                tables: [],
                syntheticDataWebLink: [],
            });

            const linked = legacy({
                linkage: {
                    syntheticDataWebLink: "https://example.com/synthetic",
                },
            }).metadata.metadata;
            expect(linked.structuralMetadata?.syntheticDataWebLink).toEqual([
                "https://example.com/synthetic",
            ]);
            expect(linked.structuralMetadata?.tables).toEqual(
                hdrukGwdm20Metadata.structuralMetadata
            );
        });

        it("keeps the dataset version's own fields", () => {
            const dataset = generateCrukGwdmDataset();
            const version = buildGwdmPageFacts(dataset).legacyVersion;

            expect(version.id).toBe(dataset.versions[0].id);
            expect(version.metadata.gwdmVersion).toBe("2.1");
        });

        it("does not mutate the dataset's native GWDM metadata", () => {
            const dataset = generateCrukGwdmDataset();
            buildGwdmPageFacts(dataset);

            expect(dataset.versions[0].metadata.metadata).toBe(
                crukGwdm21Metadata
            );
            expect(crukGwdm21Metadata).not.toHaveProperty(
                "summary.dataCustodian"
            );
        });
    });
});

describe("resolveGwdmScrollTarget", () => {
    it("maps the production page's anchors onto GWDM section anchors", () => {
        expect(resolveGwdmScrollTarget("anchor-StructuralMetadata")).toBe(
            "section-structuralMetadata"
        );
        expect(resolveGwdmScrollTarget("anchor-Demographics")).toBe(
            "section-demographicFrequency"
        );
        expect(resolveGwdmScrollTarget("anchor-DataAccessRequest")).toBe(
            "section-accessibility"
        );
    });

    it("covers every target the production stats and mind map use", () => {
        expect(Object.keys(GWDM_SCROLL_TARGETS).sort()).toEqual(
            [
                "anchor-Coverage",
                "anchor-DataAccessRequest",
                "anchor-Demographics",
                "anchor-Documentation",
                "anchor-Provenance",
                "anchor-StructuralMetadata",
            ].sort()
        );
    });

    it("passes an unknown target through unchanged", () => {
        expect(resolveGwdmScrollTarget("section-summary")).toBe(
            "section-summary"
        );
    });
});
