import { FormHydration, FormHydrationField } from "@/interfaces/FormHydration";
import {
    DarApplicationApprovalStatus,
    DarApplicationStatus,
} from "@/consts/dataAccess";
import { ComponentTypes } from "./ComponentTypes";
import { UploadedFileMetadata } from "./FileUpload";

interface DarQuestion {
    id: number | string;
    boardId: number | string;
    order: number;
    title: string;
    guidance: string;
    original_guidance: string;
    required: boolean;
    force_required: boolean;
    allow_guidance_override?: boolean;
    hasChanged: boolean;
    component: string;
    question_json: FormHydration;
}

interface DarHasQuestion {
    template_id: number;
    question_id: number;
    guidance: string;
    required: number;
    order: number;
    section_id: number;
    force_required: number;
    allow_guidance_override: number;
}

interface DarTemplate {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    team_id: number;
    user_id: number;
    published: number;
    locked: number;
    questions: DarHasQuestion[];
}

type Validations = {
    min?: number;
    max?: number;
    type?: string;
    format?: string;
    pattern?: string;
};

interface DarApplicationQuestion {
    appliciation_id: number;
    question_id: number;
    guidance: string;
    order: number;
    required: boolean;
    title: string;
    section_id: number;
    validations: Validations;
    is_child: number;
    component: ComponentTypes;
    options: {
        label: string;
        children: DarApplicationQuestion[];
    }[];
}

interface DarApplicationAnswer {
    application_id: number;
    question_id: number;
    contributor_id: number;
    answer: string;
}

interface DarTemplateCountResponse {
    active_count: number;
    non_active_count: number;
}

interface DarApplication {
    id: number;
    questions: DarApplicationQuestion[];
    project_title: string;
    applicant_id: number;
    submission_date: string;
    teams: {
        approval_status: DarApplicationApprovalStatus;
        created_at: string;
        dar_application_id: number;
        id: number;
        review_id: number;
        submission_status: DarApplicationStatus;
        team_id: number;
        updated_at: string;
    }[];
}

interface DarApplicationResponses {
    [key: string]:
        | string
        | { value: UploadedFileMetadata }
        | { value: UploadedFileMetadata[] }
        | undefined;
    project_title?: string;
}

interface DarFormattedField extends FormHydrationField {
    question_id: number;
    section_id: number;
    is_child?: boolean;
    options: {
        label: string;
        value: string;
        children: DarFormattedField[];
    }[];
}

export type {
    DarTemplate,
    DarQuestion,
    DarHasQuestion,
    DarApplicationQuestion,
    DarApplicationAnswer,
    DarApplication,
    DarApplicationResponses,
    DarFormattedField,
    DarTemplateCountResponse,
};
