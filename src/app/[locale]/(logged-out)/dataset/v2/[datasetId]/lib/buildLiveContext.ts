import { get, isEmpty, pick } from "lodash";
import { Dataset, VersionItem } from "@/interfaces/Dataset";
import {
    datasetFields,
    DatasetSection,
} from "@/app/[locale]/(logged-out)/dataset/[datasetId]/config";

const DATASET_STAT_PATHS = [
    "metadata.metadata.summary.populationSize",
    "metadata.metadata.provenance.temporal.startDate",
    "metadata.metadata.provenance.temporal.endDate",
    "metadata.metadata.coverage.materialType",
    "metadata.metadata.coverage.spatial",
    "metadata.metadata.accessibility.access.deliveryLeadTime",
];

const readString = (
    source: Record<string, unknown>,
    path: string
): string | undefined => {
    const value: unknown = get(source, path);
    return typeof value === "string" ? value : undefined;
};

export interface EffectiveSchema {
    schemaName: string;
    schemaVersion: string;
    translated: boolean;
}

export function resolveEffectiveSchema(
    dataset: Dataset,
    requestedModel?: string,
    requestedVersion?: string
): EffectiveSchema {
    if (requestedModel && requestedVersion) {
        return {
            schemaName: requestedModel,
            schemaVersion: requestedVersion,
            translated: true,
        };
    }

    const version = dataset.versions[0] as VersionItem & {
        gwdm_version?: string;
    };

    return {
        schemaName: "GWDM",
        schemaVersion:
            version.metadata?.gwdmVersion ?? version.gwdm_version ?? "unknown",
        translated: false,
    };
}

export interface LiveContextParts {
    dataset: Dataset;
    datasetVersion: VersionItem;
    datasetStats: Partial<VersionItem>;
    populatedSections: DatasetSection[];
    linkageCounts: Record<string, number>;
    dataCustodianName?: string;
    title?: string;
    data: Record<string, unknown>;
}

export function buildLiveContext(dataset: Dataset): LiveContextParts {
    const version = dataset.versions[0];
    const metadata = version.metadata.metadata as unknown as Record<
        string,
        unknown
    >;

    // DatasetMindMap reads structuralMetadata.syntheticDataWebLink[0] guarded
    // only as far as structuralMetadata, so the key must always be present.
    const existingStructuralMetadata =
        (metadata.structuralMetadata as Record<string, unknown> | undefined) ??
        {};

    const normalisedMetadata = {
        ...metadata,
        structuralMetadata: {
            tables: [],
            syntheticDataWebLink: [],
            ...existingStructuralMetadata,
        },
    };

    const datasetVersion: VersionItem = {
        ...version,
        metadata: {
            ...version.metadata,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            metadata: normalisedMetadata as any,
        },
    };

    const datasetStats = pick(datasetVersion, DATASET_STAT_PATHS);

    const populatedSections = datasetFields.filter(section =>
        section.fields.some(field => !isEmpty(get(datasetVersion, field.path)))
    );

    const publications = (dataset.publications ?? []) as unknown as {
        dataset_versions?: { link_type?: string }[];
    }[];
    const countByLinkType = (type: string) =>
        publications.filter(pub =>
            pub.dataset_versions?.some(version => version.link_type === type)
        ).length;

    return {
        dataset,
        datasetVersion,
        datasetStats,
        populatedSections,
        linkageCounts: {
            tools: dataset.tools_count,
            publications: dataset.publications_count,
            publications_about: countByLinkType("ABOUT"),
            publications_using: countByLinkType("USING"),
            durs: dataset.durs_count,
            collections: dataset.collections_count,
        },
        // HDRUK keeps this at summary.dataCustodian.name, GWDM at
        // summary.publisher.name.
        dataCustodianName:
            readString(normalisedMetadata, "summary.dataCustodian.name") ??
            readString(normalisedMetadata, "summary.publisher.name"),
        title: readString(normalisedMetadata, "summary.title"),
        data: normalisedMetadata,
    };
}
