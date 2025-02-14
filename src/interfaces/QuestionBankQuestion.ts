import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { Team } from "./Team";

interface QBFields {
    title: string;
    guidance: string;
    label?: string;
    required: boolean;
    allow_guidance_override: boolean;
    force_required: boolean;
    component: ComponentTypes;
    options: [];
    all_custodians: boolean;
    team_ids: number[];
}

type Nested = {
    [key: string]: QBFields[];
};

type Validations = {
    min?: number;
    max?: number;
    type?: string;
    format?: string;
    pattern?: string;
};

interface QuestionBankQuestionForm extends QBFields {
    section_id: number;
    team_ids: number[];
    all_custodians: boolean;
    children: QBFields[];
    default: boolean;
    options: [];
    validations: Validations;
}

interface NestedOption {
    label: string;
    children: Nested;
}

interface QuestionBankCreateUpdateQuestion {
    required: boolean;
    allow_guidance_override: number;
    force_required: number;
    team_ids?: number[];
    user_id?: number;
    section_id: number;
    guidance: string;
    title: string;
    options: NestedOption[];
    all_custodians: boolean;
}

interface QuestionBankItem {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    version: number;
    required: number;
}

interface QuestionBankChildItem extends QuestionBankItem {
    pivot: {
        parent_qbv_id: number;
        child_qbv_id: number;
        condition: string;
    };
}

interface QuestionBankVersion extends QuestionBankItem {
    child_versions: QuestionBankChildItem[];
}

interface QuestionBankQuestion extends QBFields {
    teams: Team[];
    question_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    locked: boolean;
    required: boolean;
    force_required: boolean;
    allow_guidance_override: boolean;
    section_id: number;
    team_ids: number[];
    version_id: number;
    user_id: number;
    default: boolean;
    archived: boolean;
    archived_date: string | null;
    is_child: number;
    all_custodians: boolean;
}

export type {
    QuestionBankQuestion,
    QuestionBankQuestionForm,
    QuestionBankCreateUpdateQuestion,
    QuestionBankVersion,
};
