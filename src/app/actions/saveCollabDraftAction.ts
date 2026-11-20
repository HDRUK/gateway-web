"use server";

import { OnboardingSaveResult } from "@/interfaces/OnboardingForm";
import { saveCollabDraft } from "@/utils/api";
import { isCollabToken } from "@/utils/collab";

interface SaveCollabDraftArgs {
    token: string;
    model: string;
    version: string;
    metadata: Record<string, unknown>;
}

/**
 * Saves an anonymous collaborator's progress. Always a draft: there is no
 * status to send, and the API never promotes a collab draft - only the team
 * can make it active, through the normal authenticated flow.
 */
export const saveCollabDraftAction = async ({
    token,
    model,
    version,
    metadata,
}: SaveCollabDraftArgs): Promise<OnboardingSaveResult> => {
    if (!isCollabToken(token)) {
        return { ok: false };
    }
    try {
        const res = await saveCollabDraft(token, {
            metadata: {
                schemaModel: model,
                schemaVersion: version,
                metadata,
            },
        });

        if (!res.ok) {
            return { ok: false, status: res.status, error: res.body };
        }
        return { ok: true };
    } catch (e) {
        console.error(e);
        return { ok: false };
    }
};
