import { Alert, Divider } from "@mui/material";
import Box from "@/components/Box";
import MetadataTemplate from "@/templates/metadata/view/MetadataTemplate";
import { getMetadataTemplate } from "@/templates/metadata/view/registry";
import metaData, { noFollowRobots } from "@/utils/metadata";
import ControlsPanel from "./components/ControlsPanel";
import SchemaPicker from "./components/SchemaPicker";
import {
    buildLiveContext,
    resolveEffectiveSchema,
} from "./lib/buildLiveContext";
import { fetchLiveDataset } from "./lib/fetchLiveDataset";
import { fetchAvailableSchemas, fetchSchema } from "./lib/fetchSchema";

export const metadata = metaData(
    {
        title: "Dataset (v2 preview)",
        description:
            "Experimental schema-driven dataset view. Not linked from the site.",
    },
    noFollowRobots
);

export default async function DatasetV2Page({
    params,
    searchParams,
}: {
    params: Promise<{ datasetId: string }>;
    searchParams: Promise<{
        schema_model?: string;
        schema_version?: string;
    }>;
}) {
    const [{ datasetId }, query] = await Promise.all([params, searchParams]);
    const { schema_model: schemaModel, schema_version: schemaVersion } = query;

    const [available, { dataset, error }] = await Promise.all([
        fetchAvailableSchemas(),
        fetchLiveDataset(datasetId, schemaModel, schemaVersion),
    ]);

    const picker = (
        <SchemaPicker
            datasetId={datasetId}
            schemaModel={schemaModel}
            schemaVersion={schemaVersion}
            available={available}
        />
    );

    if (!dataset) {
        return (
            <Box>
                <ControlsPanel summary={`dataset ${datasetId} - failed`}>
                    {picker}
                </ControlsPanel>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    const effective = resolveEffectiveSchema(
        dataset,
        schemaModel,
        schemaVersion
    );
    const [schema, context] = await Promise.all([
        fetchSchema(effective.schemaName, effective.schemaVersion),
        Promise.resolve(buildLiveContext(dataset)),
    ]);

    const { source } = getMetadataTemplate(
        effective.schemaName,
        effective.schemaVersion
    );

    const summary = [
        `dataset ${datasetId}`,
        `${effective.schemaName} ${effective.schemaVersion}${
            effective.translated ? " (translated)" : ""
        }`,
        source,
    ].join("  -  ");

    return (
        <Box sx={{ p: 0 }}>
            <Box sx={{ px: 2, pt: 2, pb: 0 }}>
                <ControlsPanel summary={summary}>{picker}</ControlsPanel>
                {!schema && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        No JSON Schema published for {effective.schemaName}{" "}
                        {effective.schemaVersion} - the generic view will be
                        empty.
                    </Alert>
                )}
            </Box>
            <Divider/>
            <MetadataTemplate
                schemaName={effective.schemaName}
                schemaVersion={effective.schemaVersion}
                context={{ ...context, schema: schema ?? {} }}
            />
        </Box>
    );
}
