import { Dataset } from "@/interfaces/Dataset";

const GATEWAY_API = "https://api.healthdatagateway.org/api/v1/datasets";
const REVALIDATE_SECONDS = 300;

export interface LiveDatasetResult {
    dataset?: Dataset;
    error?: string;
    requestedUrl: string;
}

const extractError = (body: unknown): string => {
    const payload = body as {
        message?: string;
        details?: { traser_message?: { message?: string } };
        errors?: { message?: string }[];
    };

    return (
        payload?.details?.traser_message?.message ??
        payload?.errors?.[0]?.message ??
        payload?.message ??
        "The Gateway API returned an error."
    );
};

export async function fetchLiveDataset(
    datasetId: string,
    schemaModel?: string,
    schemaVersion?: string
): Promise<LiveDatasetResult> {
    const params = new URLSearchParams();
    if (schemaModel && schemaVersion) {
        params.append("schema_model", schemaModel);
        params.append("schema_version", schemaVersion);
    }

    const query = params.toString();
    const requestedUrl = `${GATEWAY_API}/${datasetId}${query ? `?${query}` : ""}`;

    try {
        const response = await fetch(requestedUrl, {
            next: {
                revalidate: REVALIDATE_SECONDS,
                tags: [`live-dataset-${datasetId}`],
            },
        });

        const body = await response.json().catch(() => undefined);

        if (!response.ok) {
            return {
                error: `${response.status} - ${extractError(body)}`,
                requestedUrl,
            };
        }

        const dataset = (body as { data?: Dataset })?.data;

        if (!dataset?.versions?.length) {
            return {
                error: "The response contained no dataset versions.",
                requestedUrl,
            };
        }

        return { dataset, requestedUrl };
    } catch (error) {
        return {
            error: `Could not reach the Gateway API - ${
                error instanceof Error ? error.message : "unknown error"
            }`,
            requestedUrl,
        };
    }
}
