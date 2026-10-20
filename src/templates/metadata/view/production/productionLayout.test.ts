import { JSONSchemaDocument, resolveAtPath } from "@/modules/MetadataView";
import { datasetFields } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/config";
import gwdm20 from "@/mocks/data/dataset/gwdm/schemas/GWDM-2.0.json";
import gwdm21 from "@/mocks/data/dataset/gwdm/schemas/GWDM-2.1.json";
import gwdm22 from "@/mocks/data/dataset/gwdm/schemas/GWDM-2.2.json";
import gwdm23 from "@/mocks/data/dataset/gwdm/schemas/GWDM-2.3.json";
import {
    buildProductionSections,
    DATA_ONLY_GWDM_PATHS,
    HDRUK_TO_GWDM,
    PRODUCTION_PATH_PREFIX,
    UNAVAILABLE_IN_GWDM,
} from "./productionLayout";

const schemas = [
    gwdm20,
    gwdm21,
    gwdm22,
    gwdm23,
] as JSONSchemaDocument[];

const inSomeGwdmVersion = (path: string) =>
    schemas.some(schema => !!resolveAtPath(schema, {}, path));

const productionPaths = datasetFields.flatMap(section =>
    section.fields.map(field => field.path.replace(PRODUCTION_PATH_PREFIX, ""))
);

describe("HDRUK_TO_GWDM", () => {
    it("accounts for every field the production page shows", () => {
        const unaccounted = productionPaths.filter(
            path =>
                !(path in HDRUK_TO_GWDM) && !UNAVAILABLE_IN_GWDM.includes(path)
        );

        expect(unaccounted).toEqual([]);
    });

    it("only maps to GWDM paths that exist in a GWDM schema", () => {
        const missing = Object.values(HDRUK_TO_GWDM)
            .flatMap(source => source.paths)
            .filter(
                path =>
                    !inSomeGwdmVersion(path) &&
                    !DATA_ONLY_GWDM_PATHS.includes(path)
            );

        expect(missing).toEqual([]);
    });

    it("lists as unavailable only fields GWDM genuinely lacks", () => {
        expect(UNAVAILABLE_IN_GWDM.sort()).toEqual(
            [
                "accessibility.access.accessMode",
                "accessibility.usage.dataUsePermissions",
            ].sort()
        );
    });
});

describe("buildProductionSections", () => {
    const data = {
        summary: {
            abstract: "An abstract.",
            doiName: "10.1234/x",
            description: "A description.",
            keywords: "One,Two",
            populationSize: 1200,
        },
        coverage: { typicalAgeRange: "18-65", followUp: "> 10 YEARS" },
        tissuesSampleCollection: [
            { materialType: "Blood" },
            { materialType: "Urine" },
            { materialType: "Blood" },
        ],
        provenance: { temporal: { accrualPeriodicity: "Daily" } },
        observations: [{ observedNode: "Persons", measuredValue: 12 }],
    };

    const sections = buildProductionSections(data);
    const titled = (title: string) =>
        sections.find(section => section.title === title);
    const field = (title: string, label: string | undefined) =>
        titled(title)?.fields.find(f => f.label === label);

    it("keeps production's section names and order, dropping empty sections", () => {
        expect(sections.map(section => section.title)).toEqual([
            "Summary",
            "Documentation",
            "Keywords",
            "Observations",
            "Provenance",
            "Details",
            "Coverage",
        ]);
    });

    it("reads each production field from its GWDM source", () => {
        expect(field("Documentation", undefined)?.value).toBe("A description.");
        expect(field("Details", "Publishing frequency")?.value).toBe("Daily");
        expect(field("Coverage", "Follow-up")?.value).toBe("> 10 YEARS");
    });

    it("splits GWDM's single age range into production's minimum and maximum", () => {
        expect(field("Coverage", "Minimum age range")?.value).toBe("18");
        expect(field("Coverage", "Maximum age range")?.value).toBe("65");
    });

    it("collects material types from GWDM's sample collections", () => {
        expect(
            field("Provenance", "Biological sample availability")?.value
        ).toEqual(["Blood", "Urine"]);
    });

    it("drops empty fields but keeps the section's others", () => {
        expect(field("Summary", "DOI for dataset")?.value).toBe("10.1234/x");
        expect(titled("Summary")?.fields).toHaveLength(2);
    });

    it("marks production's special sections with their GWDM key", () => {
        expect(titled("Observations")?.special).toBe("observations");
    });

    it("keeps the GWDM path each field came from, for path-aware rendering", () => {
        expect(field("Summary", "DOI for dataset")?.gwdmPath).toBe(
            "summary.doiName"
        );
    });
});
