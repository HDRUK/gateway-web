"use server";

import { OnboardingSaveResult } from "@/interfaces/OnboardingForm";
import { DataStatus } from "@/consts/application";
import { saveTeamDataset } from "@/utils/api";

interface SaveSchemaDatasetArgs {
    teamId: string;
    datasetId?: string;
    model: string;
    version: string;
    status: DataStatus.ACTIVE | DataStatus.DRAFT;
    metadata: Record<string, unknown>;
    isCohortDiscovery?: boolean;
}

const messagesOf = ({ message, errors }: Record<string, unknown>): string[] =>
    [
        message,
        ...(Array.isArray(errors) ? errors.map(error => error?.message) : []),
    ].filter((text): text is string => typeof text === "string");

export const saveSchemaDatasetAction = async ({
    teamId,
    datasetId,
    model,
    version,
    status,
    metadata,
    isCohortDiscovery,
}: SaveSchemaDatasetArgs): Promise<OnboardingSaveResult> => {
    try {
        const query = new URLSearchParams({
            input_schema: model,
            input_version: version,
        }).toString();

        const res = await saveTeamDataset(teamId, datasetId, query, {
            team_id: Number(teamId),
            status,
            create_origin: "MANUAL",
            is_cohort_discovery: isCohortDiscovery,
            metadata: {
                schemaModel: model,
                schemaVersion: version,
                metadata,
            },
        });

        if (!res.ok) {
            const errors = messagesOf(res.body);
            return { ok: false, errors: errors.length ? errors : undefined };
        }
        return {
            ok: true,
            datasetId: Number(res.body.data) || Number(datasetId),
        };
    } catch (e) {
        console.error(e);
        return { ok: false };
    }
};
