interface AdminDeletionCheckDataset {
    id: number;
    title: string;
}

interface AdminDeletionCheckTool {
    id: number;
    name: string;
}

interface AdminDeletionCheckApplication {
    id: number;
    name: string;
}

interface AdminDeletionCheckReview {
    id: number;
    review_text: string;
}

interface AdminDeletionCheckCohortRequest {
    id: number;
}

interface AdminDeletionCheckEnquiryThread {
    id: number;
    project_title: string;
}

interface AdminDeletionCheckCollection {
    id: number;
    name: string;
}

interface UserPickerTeam {
    id: number;
    name: string;
}

interface UserPickerOption {
    id: number;
    firstname: string;
    lastname: string;
    name: string;
    teams: UserPickerTeam[];
}

interface UserDeletionCheck {
    datasets: AdminDeletionCheckDataset[];
    tools: AdminDeletionCheckTool[];
    applications: AdminDeletionCheckApplication[];
    reviews: AdminDeletionCheckReview[];
    cohort_requests: AdminDeletionCheckCohortRequest[];
    enquiry_threads: AdminDeletionCheckEnquiryThread[];
    collections: AdminDeletionCheckCollection[];
}

type ReassignEntityType =
    | "dataset"
    | "tool"
    | "application"
    | "review"
    | "cohort_request"
    | "enquiry_thread"
    | "collection";

interface Reassignment {
    entity_type: ReassignEntityType;
    entity_id: number;
    new_user_id?: number;
    delete?: boolean;
}

interface TransferAndDeletePayload {
    reassignments: Reassignment[];
}

export type {
    AdminDeletionCheckDataset,
    AdminDeletionCheckTool,
    AdminDeletionCheckApplication,
    AdminDeletionCheckReview,
    AdminDeletionCheckCohortRequest,
    AdminDeletionCheckEnquiryThread,
    AdminDeletionCheckCollection,
    UserPickerTeam,
    UserPickerOption,
    UserDeletionCheck,
    ReassignEntityType,
    Reassignment,
    TransferAndDeletePayload,
};
