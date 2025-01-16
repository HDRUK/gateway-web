import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { FormHydrationField } from "./FormHydration";

interface QBFields {
    guidance: string;
    title: string;
    label: string;
    required: boolean;
    field: { component: ComponentTypes };
    settings: {
        mandatory: boolean;
        allow_guidance_override: boolean;
        force_required: boolean;
    };
}

type Nested = {
    [key: string]: QBFields[];
};

interface QuestionBankQuestionForm extends QBFields {
    section_id: number;
    children: QBFields[];
}

interface NestedOption {
    label: string;
    children: Nested;
}

interface QuestionBankCreateUpdateQuestion {
    required: boolean;
    allow_guidance_override: number;
    force_required: number;
    team_id?: number;
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

interface QuestionBankQuestion {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    latest_version: QuestionBankVersion;
    versions: QuestionBankVersion[];
    locked: number;
    required: number;
    force_required: number;
    allow_guidance_override: number;
    section_id: number;
    user_id: number;
}

export type {
    QuestionBankQuestion,
    QuestionBankQuestionForm,
    QuestionBankCreateUpdateQuestion,
    QuestionBankVersion,
};
