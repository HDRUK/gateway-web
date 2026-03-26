import { FormHydration, FormHydrationField } from "@/interfaces/FormHydration";
import { ComponentTypes } from "./ComponentTypes";
import { DarTeamApplication } from "./DataAccessRequestApplication";
import { UploadedFileMetadata, UploadedFileMetadataValue } from "./FileUpload";

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
    published: boolean;
    locked: number;
    questions: DarHasQuestion[];
    template_type: "FORM" | "DOCUMENT";
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
    fields?: DarApplicationQuestion[];
    document?: UploadedFileMetadata;
}

interface DarApplicationAnswer {
    application_id: number;
    question_id: number;
    contributor_id: number;
    answer: string | string[];
    answer_index?: number;
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
    teams: DarTeamApplication[];
    application_type: "FORM" | "DOCUMENT";
}

interface DarApplicationResponses {
    [key: string]:
        | string
        | { value: UploadedFileMetadataValue }
        | { value: UploadedFileMetadataValue[] }
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
    fields?: DarApplicationQuestion[];
    document?: UploadedFileMetadata;
    guidance?: string;
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
