"use server";

import type { Error } from "@/interfaces/Error";
import { markCollabReady } from "@/utils/api";
import { isCollabToken } from "@/utils/collab";

interface MarkCollabReadyResult {
    ok: boolean;
    readyForReviewAt?: string | null;
    status?: number;
    error?: Error;
}

/**
 * Flags (or un-flags) a collab draft as ready for the team to review. Never
 * changes the dataset's status.
 */
export const markCollabReadyAction = async (
    token: string,
    ready: boolean
): Promise<MarkCollabReadyResult> => {
    if (!isCollabToken(token)) {
        return { ok: false };
    }
    try {
        const res = await markCollabReady(token, ready);

        if (!res.ok) {
            return { ok: false, status: res.status, error: res.body };
        }
        const data = res.body.data as
            | { ready_for_review_at?: string | null }
            | undefined;
        return {
            ok: true,
            readyForReviewAt: data?.ready_for_review_at ?? null,
        };
    } catch {
        return { ok: false };
    }
};
