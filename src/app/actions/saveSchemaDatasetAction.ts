"use server";

import { OnboardingSaveResult } from "@/interfaces/OnboardingForm";
import { DataStatus } from "@/consts/application";
import { DEFAULT_PARTNER_CONTEXT, PARTNER_SCHEMAS } from "@/consts/schema";
import { saveTeamDataset } from "@/utils/api";
import { isSchemaOnboardingFormSelectorEnabled } from "@/flags";

interface SaveSchemaDatasetArgs {
    teamId: string;
    datasetId?: string;
    model: string;
    version: string;
    status: DataStatus.ACTIVE | DataStatus.DRAFT;
    metadata: Record<string, unknown>;
    isCohortDiscovery?: boolean;
}

export const saveSchemaDatasetAction = async ({
    teamId,
    datasetId,
    model,
    version,
    status,
    metadata,
    isCohortDiscovery,
}: SaveSchemaDatasetArgs): Promise<OnboardingSaveResult> => {
    if (!/^\d+$/.test(teamId) || (datasetId && !/^\d+$/.test(datasetId))) {
        return { ok: false };
    }
    try {
        const query = new URLSearchParams({
            input_schema: model,
            input_version: version,
        }).toString();

        const partnerContext = (await isSchemaOnboardingFormSelectorEnabled())
            ? PARTNER_SCHEMAS.includes(model)
                ? model
                : DEFAULT_PARTNER_CONTEXT
            : undefined;

        const res = await saveTeamDataset(
            teamId,
            datasetId,
            query,
            {
                team_id: Number(teamId),
                status,
                create_origin: "MANUAL",
                is_cohort_discovery: isCohortDiscovery,
                metadata: {
                    schemaModel: model,
                    schemaVersion: version,
                    metadata,
                },
            },
            partnerContext
        );

        if (!res.ok) {
            return { ok: false, status: res.status, error: res.body };
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
