import { Dataset } from "./Dataset";
import { OnboardingForm } from "./OnboardingForm";

/** GET /v2/collab/{token} - public, authorised only by the share token. */
interface CollabDraft {
    dataset_id: number;
    team_id: number;
    // Anonymous collaborators can't call the authenticated GET /teams/{id}
    // endpoint, so the one team field the form needs is surfaced here.
    team_contact_point: string | null;
    // The same hydrated form the authenticated form_hydration endpoint
    // returns, for the requested (or default) schema.
    form: OnboardingForm;
    expires_at: string | null;
    ready_for_review_at: string | null;
}

// Derived server-side from revoked_at/expires_at and the linked dataset's
// own status (see DatasetShareToken::getStatusAttribute()) - not a stored
// column, so it's the only reliable way to tell "draft went live"
// (completed) apart from "revoked by hand" apart from "link expired unused".
type ShareTokenStatus = "active" | "completed" | "revoked" | "expired";

interface ShareToken {
    id: number;
    team_id: number;
    dataset_id: number;
    created_by: number;
    token: string;
    expires_at: string | null;
    revoked_at: string | null;
    last_submitted_at: string | null;
    ready_for_review_at: string | null;
    created_at: string;
    updated_at: string;
    status: ShareTokenStatus;
    dataset?: Partial<Dataset>;
}

export type { CollabDraft, ShareToken, ShareTokenStatus };
