import { get, isEmpty, uniq } from "lodash";
import { FieldType } from "@/interfaces/FieldType";
import { formatTextDelimiter } from "@/utils/dataset";
import { datasetFields } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/config";

/**
 * The production dataset page's layout - its sections, field labels and
 * tooltips (`datasetFields`) - applied to native GWDM.
 *
 * `datasetFields` addresses HDRUK 4.1.0 paths, so each is mapped to the GWDM
 * field it is translated from. The map was derived from TRASER itself: a GWDM
 * 2.1 record with a unique value in every field was translated to HDRUK 4.1.0
 * and each value traced to where it landed. Fields whose values TRASER drops
 * (enum codes outside HDRUK's lists) are mapped by name. Labels, tooltips and
 * order stay in `datasetFields`, so this follows it if the page changes.
 */

export const PRODUCTION_PATH_PREFIX = "metadata.metadata.";

type Data = Record<string, unknown>;

export interface GwdmSource {
    /** GWDM paths to read, in order; the first non-empty value wins. */
    paths: string[];
    /** Reshapes the GWDM value into what the production field shows. */
    transform?: (value: unknown) => unknown;
}

const from = (...paths: string[]): GwdmSource => ({ paths });

const ageRangePart = (index: number) => (value: unknown) =>
    typeof value === "string"
        ? value.split("-")[index]?.trim() || undefined
        : undefined;

export const HDRUK_TO_GWDM: Record<string, GwdmSource> = {
    "summary.abstract": from("summary.abstract"),
    "summary.doiName": from("summary.doiName"),
    "documentation.description": from("summary.description"),
    "provenance.origin.datasetType": from("summary.datasetType"),
    "provenance.origin.datasetSubType": from("summary.datasetSubType"),
    "summary.populationSize": from("summary.populationSize"),
    "documentation.associatedMedia": from("linkage.associatedMedia"),
    "structuralMetadata.syntheticDataWebLink": from(
        "linkage.syntheticDataWebLink"
    ),
    "summary.keywords": from("summary.keywords"),
    "summary.datasetAliases": from("summary.datasetAliases"),
    observations: from("observations"),
    "provenance.origin.purpose": from("provenance.origin.purpose"),
    "provenance.origin.source": from("provenance.origin.source"),
    "provenance.origin.collectionSource": from(
        "provenance.origin.collectionSituation"
    ),
    "coverage.pathway": from("coverage.pathway"),
    "provenance.origin.imageContrast": from("provenance.origin.imageContrast"),
    // GWDM records material type per sample collection.
    "coverage.materialType": {
        paths: ["tissuesSampleCollection"],
        transform: value =>
            Array.isArray(value)
                ? uniq(
                      value
                          .map(item => (item as Data)?.materialType)
                          .filter((type): type is string => !!type)
                  )
                : undefined,
    },
    "structuralMetadata.tables": from("structuralMetadata"),
    "provenance.temporal.publishingFrequency": from(
        "provenance.temporal.accrualPeriodicity"
    ),
    version: from("required.version"),
    modified: from("required.modified"),
    "provenance.temporal.distributionReleaseDate": from(
        "provenance.temporal.distributionReleaseDate"
    ),
    // Production renders citation requirements through formatTextDelimiter.
    "accessibility.usage.resourceCreator": {
        paths: ["accessibility.usage.resourceCreator.name"],
        transform: value =>
            typeof value === "string" ? formatTextDelimiter(value) : value,
    },
    "provenance.temporal.startDate": from("provenance.temporal.startDate"),
    "provenance.temporal.endDate": from("provenance.temporal.endDate"),
    "provenance.temporal.timeLag": from("provenance.temporal.timeLag"),
    "coverage.spatial": from("coverage.spatial"),
    // GWDM holds the range as one "min-max" string.
    "coverage.typicalAgeRangeMin": {
        paths: ["coverage.typicalAgeRange"],
        transform: ageRangePart(0),
    },
    "coverage.typicalAgeRangeMax": {
        paths: ["coverage.typicalAgeRange"],
        transform: ageRangePart(1),
    },
    // Some GWDM 2.0 records spell it "followup".
    "coverage.followUp": from("coverage.followUp", "coverage.followup"),
    "coverage.datasetCompleteness": from("coverage.datasetCompleteness"),
    "omics.assay": from("omics.assay"),
    "omics.platform": from("omics.platform"),
    "accessibility.formatAndStandards.language": from(
        "accessibility.formatAndStandards.languages"
    ),
    "accessibility.formatAndStandards.conformsTo": from(
        "accessibility.formatAndStandards.conformsTo"
    ),
    "accessibility.formatAndStandards.vocabularyEncodingScheme": from(
        "accessibility.formatAndStandards.vocabularyEncodingSchemes"
    ),
    "accessibility.formatAndStandards.format": from(
        "accessibility.formatAndStandards.formats"
    ),
    "documentation.inPipeline": from("summary.inPipeline"),
    "accessibility.access.accessRights": from(
        "accessibility.access.accessRights"
    ),
    "accessibility.access.deliveryLeadTime": from(
        "accessibility.access.deliveryLeadTime"
    ),
    "accessibility.access.accessRequestCost": from(
        "accessibility.access.accessRequestCost"
    ),
    "accessibility.access.accessServiceCategory": from(
        "accessibility.access.accessServiceCategory"
    ),
    "accessibility.access.accessService": from(
        "accessibility.access.accessService"
    ),
    "accessibility.access.jurisdiction": from(
        "accessibility.access.jurisdiction"
    ),
    "accessibility.usage.dataUseLimitation": from(
        "accessibility.usage.dataUseLimitation"
    ),
    "accessibility.usage.dataUseRequirements": from(
        "accessibility.usage.dataUseRequirement"
    ),
    // GWDM 2.2+.
    "accessibility.usage.duoCodes": from("accessibility.usage.duoCodes"),
    "accessibility.access.dataController": from(
        "accessibility.access.dataController"
    ),
    "accessibility.access.dataProcessor": from(
        "accessibility.access.dataProcessor"
    ),
    "enrichmentAndLinkage.investigations": from("linkage.investigations"),
    "enrichmentAndLinkage.tools": from("linkage.tools"),
    demographicFrequency: from("demographicFrequency"),
};

/** Production fields no GWDM version has; their rows never render. */
export const UNAVAILABLE_IN_GWDM = [
    "accessibility.access.accessMode",
    "accessibility.usage.dataUsePermissions",
];

/** GWDM paths some records carry although no GWDM schema declares them. */
export const DATA_ONLY_GWDM_PATHS = [
    "summary.datasetAliases",
    "coverage.followup",
];

/** Production sections rendered by a dedicated component, by GWDM key. */
const SPECIAL_SECTIONS: Record<string, string> = {
    Observations: "observations",
    Demographics: "demographicFrequency",
    "Structural Metadata": "structuralMetadata",
};

// Production's row filter: falsy, -1, and empty arrays/objects drop.
const isEmptyValue = (value: unknown) =>
    !value ||
    value === -1 ||
    (Array.isArray(value) && !value.length) ||
    (typeof value === "object" && isEmpty(value));

export interface ProductionField {
    type: FieldType;
    label?: string;
    tooltip?: string;
    value: unknown;
    /** The GWDM path read, so renderers can apply path-specific rules. */
    gwdmPath: string;
}

export interface ProductionSection {
    title: string;
    /** The GWDM key of a section rendered by a dedicated component. */
    special?: string;
    /** The special section's GWDM value. */
    value?: unknown;
    fields: ProductionField[];
}

const readSource = (data: Data, source: GwdmSource) => {
    for (const path of source.paths) {
        const raw = get(data, path);
        const value = source.transform ? source.transform(raw) : raw;
        if (!isEmptyValue(value)) return { value, gwdmPath: path };
    }
    return { value: undefined, gwdmPath: source.paths[0] };
};

/**
 * Production's sections, in its order, populated from GWDM. A section shows
 * when production's own rule - any field non-empty by lodash `isEmpty` -
 * holds; within it, only non-empty fields are kept.
 */
export const buildProductionSections = (data: Data): ProductionSection[] =>
    datasetFields
        .map(section => {
            const fields = section.fields
                .map(field => {
                    const source =
                        HDRUK_TO_GWDM[
                            field.path.replace(PRODUCTION_PATH_PREFIX, "")
                        ];
                    if (!source) return null;
                    return {
                        type: field.type,
                        label: field.label,
                        tooltip: field.tooltip,
                        ...readSource(data, source),
                    };
                })
                .filter((field): field is ProductionField => !!field);

            const special = SPECIAL_SECTIONS[section.sectionName];

            return {
                title: section.sectionName,
                special,
                value: special ? get(data, special) : undefined,
                // isEmpty, as production uses to decide if a section shows.
                populated: fields.some(field => !isEmpty(field.value)),
                fields: fields.filter(field => !isEmptyValue(field.value)),
            };
        })
        .filter(section => section.populated)
        .map(({ populated, ...section }) => section);
