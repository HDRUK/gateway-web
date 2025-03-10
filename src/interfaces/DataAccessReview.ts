export interface DarMessage {
    comment: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    id: number;
    review_id: number;
    team_id: number;
    user_id: number | null;
}

export interface DarReviewsResponse {
    application_id: number;
    comments: DarMessage[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    id: number;
    resolved: number;
}
