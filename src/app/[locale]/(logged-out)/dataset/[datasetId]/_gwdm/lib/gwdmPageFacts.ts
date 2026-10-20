import { get, isEmpty, some, uniq } from "lodash";
import { Dataset, DatasetSchemaInfo, VersionItem } from "@/interfaces/Dataset";
import {
    isDelimitedList,
    sectionAnchorId,
    splitDelimitedList,
} from "@/modules/MetadataView";

/** The partner used when the API does not say which context owns a dataset. */
const FALLBACK_PARTNER = "HDRUK";

type GwdmMetadata = Record<string, unknown>;

/**
 * What the branded page chrome needs to know about a dataset, read from its
 * native GWDM metadata. The chrome is fixed for every schema and partner, so
 * it reads these facts rather than reaching into metadata paths itself.
 */
export interface GwdmPageFacts {
    title?: string;
    custodianName?: string;
    /** The partner context that owns the dataset - selects the template. */
    partner: string;
    gwdmVersion: string | null;
    /**
     * The schema the dataset was submitted in (e.g. CRUK 1.0.0) - the partner
     * ingestion standard, never GWDM. Null when not recorded.
     */
    sourceSchema: DatasetSchemaInfo | null;
    /** The record's own metadata version, from GWDM's required block. */
    metadataVersion?: string;
    issued?: string;
    modified?: string;
    datasetTypes: string[];
    datasetSubTypes: string[];
    collectionSituations: string[];
    hasStructuralMetadata: boolean;
    hasDemographics: boolean;
    /**
     * The dataset version reshaped onto the HDRUK paths that the production
     * chrome components (DatasetStats, DatasetMindMap, ActionBar) still read.
     * A compatibility view only - retire it once those components read
     * GwdmPageFacts directly.
     */
    legacyVersion: VersionItem;
}

const readString = (source: unknown, path: string): string | undefined => {
    const value: unknown = get(source, path);
    return typeof value === "string" && value.trim() ? value : undefined;
};

/** GWDM stores many lists as `;,;`-delimited strings; normalise to arrays. */
const readList = (source: unknown, path: string): string[] => {
    const value: unknown = get(source, path);

    if (Array.isArray(value)) {
        return value.filter(
            (item): item is string => typeof item === "string" && !!item
        );
    }
    if (isDelimitedList(value)) return splitDelimitedList(value);

    return typeof value === "string" && value.trim() ? [value.trim()] : [];
};

const asArray = <T>(value: T | T[] | null | undefined): T[] => {
    if (value === null || value === undefined || value === "") return [];
    return Array.isArray(value) ? value : [value];
};

/** GWDM records material type per sample collection, not under coverage. */
const materialTypes = (metadata: GwdmMetadata): string[] =>
    uniq(
        asArray(
            metadata.tissuesSampleCollection as Record<string, unknown>[]
        ).flatMap(collection => readList(collection, "materialType"))
    );

const buildLegacyVersion = (
    version: VersionItem,
    metadata: GwdmMetadata,
    custodianName: string | undefined
): VersionItem => {
    const summary = (metadata.summary ?? {}) as Record<string, unknown>;
    const types = materialTypes(metadata);

    const legacyMetadata = {
        summary: {
            ...summary,
            dataCustodian: custodianName ? { name: custodianName } : undefined,
        },
        provenance: {
            temporal: get(metadata, "provenance.temporal") ?? {},
        },
        coverage: {
            spatial: get(metadata, "coverage.spatial"),
            datasetCompleteness: get(metadata, "coverage.datasetCompleteness"),
            materialType: types.length ? types : undefined,
        },
        accessibility: {
            access: {
                deliveryLeadTime: get(
                    metadata,
                    "accessibility.access.deliveryLeadTime"
                ),
            },
        },
        // GWDM holds tables as a flat array and the synthetic data link under
        // linkage; the chrome expects HDRUK's { tables, syntheticDataWebLink }
        // and indexes syntheticDataWebLink[0] without a guard.
        structuralMetadata: {
            tables: asArray(metadata.structuralMetadata as unknown[]),
            syntheticDataWebLink: asArray(
                get(metadata, "linkage.syntheticDataWebLink") as
                    | string
                    | string[]
                    | undefined
            ),
        },
        demographicFrequency: metadata.demographicFrequency,
    };

    return {
        ...version,
        metadata: {
            ...version.metadata,
            // The legacy `Metadata` interface describes HDRUK, which this
            // compatibility view only partially satisfies.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            metadata: legacyMetadata as any,
        },
    };
};

export const buildGwdmPageFacts = (dataset: Dataset): GwdmPageFacts => {
    const version = dataset.versions[0];
    const metadata = (version.metadata?.metadata ??
        {}) as unknown as GwdmMetadata;

    const custodianName = readString(metadata, "summary.publisher.name");
    const demographics = metadata.demographicFrequency;

    return {
        title: readString(metadata, "summary.title"),
        custodianName,
        partner: dataset.partner_context ?? FALLBACK_PARTNER,
        sourceSchema: dataset.source_schema ?? null,
        metadataVersion: readString(metadata, "required.version"),
        issued: readString(metadata, "required.issued"),
        modified: readString(metadata, "required.modified"),
        gwdmVersion:
            dataset.schema?.version ??
            version.metadata?.gwdmVersion ??
            version.gwdm_version ??
            null,
        datasetTypes: readList(metadata, "summary.datasetType"),
        datasetSubTypes: readList(metadata, "summary.datasetSubType"),
        collectionSituations: readList(
            metadata,
            "provenance.origin.collectionSituation"
        ),
        hasStructuralMetadata: !isEmpty(metadata.structuralMetadata),
        hasDemographics:
            !!demographics &&
            typeof demographics === "object" &&
            some(demographics as object, value => value !== null),
        legacyVersion: buildLegacyVersion(version, metadata, custodianName),
    };
};

/**
 * The production page's section anchors, as hardcoded in DatasetStats and
 * DatasetMindMap, mapped onto the anchors of the GWDM sections they point at.
 */
export const GWDM_SCROLL_TARGETS: Record<string, string> = {
    "anchor-Documentation": sectionAnchorId("summary"),
    "anchor-Coverage": sectionAnchorId("coverage"),
    "anchor-Provenance": sectionAnchorId("provenance"),
    "anchor-DataAccessRequest": sectionAnchorId("accessibility"),
    "anchor-StructuralMetadata": sectionAnchorId("structuralMetadata"),
    "anchor-Demographics": sectionAnchorId("demographicFrequency"),
};

export const resolveGwdmScrollTarget = (target: string): string =>
    GWDM_SCROLL_TARGETS[target] ?? target;
