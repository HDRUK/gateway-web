import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { FormHydrationField } from "./FormHydration";

interface QBFields {
    title: string;
    guidance: string;
    label?: string;
    required: boolean;
    allow_guidance_override: boolean;
    force_required: boolean;
    component: ComponentTypes;
    options: [];
}

type Nested = {
    [key: string]: QBFields[];
};

interface QuestionBankQuestionForm extends QBFields {
    section_id: number;
    team_ids: number[];
    all_custodians: boolean;
    children: QBFields[];
    default: number;
    options: [];
    validations: string[];
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
    field: FormHydrationField;
    guidance: string;
    title: string;
    options: NestedOption[];
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

// interface QuestionValidation {
//     message: string;
//     min?: number;
// }

// interface QuestionFields {
//     title: string;
//     guidance: string;
//     options: [];
//     component: string;
//     validations: QuestionValidation[];
// }

interface QuestionBankQuestion extends QBFields {
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
    question_type: string;
}

export type {
    QuestionBankQuestion,
    QuestionBankQuestionForm,
    QuestionBankCreateUpdateQuestion,
    QuestionBankVersion,
};
