import { JSONSchemaDocument } from "@/modules/MetadataView";
import { SCHEMA_BRANCH } from "@/consts/schema";

const SCHEMATA_RAW = `https://raw.githubusercontent.com/HDRUK/schemata-2/${SCHEMA_BRANCH}`;
const REVALIDATE_SECONDS = 3600;

export type AvailableSchemas = Record<string, string[]>;

export async function fetchAvailableSchemas(): Promise<AvailableSchemas> {
    try {
        const response = await fetch(`${SCHEMATA_RAW}/available.json`, {
            next: {
                revalidate: REVALIDATE_SECONDS,
                tags: ["schemata-available"],
            },
        });

        if (!response.ok) return {};

        return (await response.json()) as AvailableSchemas;
    } catch {
        return {};
    }
}

export async function fetchSchema(
    schemaName: string,
    schemaVersion: string
): Promise<JSONSchemaDocument | undefined> {
    try {
        const response = await fetch(
            `${SCHEMATA_RAW}/hdr_schemata/models/${schemaName}/${schemaVersion}/schema.json`,
            {
                next: {
                    revalidate: REVALIDATE_SECONDS,
                    tags: [`schemata-${schemaName}-${schemaVersion}`],
                },
            }
        );

        if (!response.ok) return undefined;

        return (await response.json()) as JSONSchemaDocument;
    } catch {
        return undefined;
    }
}
