import { ComponentTypes } from "@/interfaces/ComponentTypes";
import { FormHydrationField } from "./FormHydration";

interface QuestionBankQuestionForm {
    section_id: number;
    guidance: string;
    type: ComponentTypes;
    title: string;
    settings: {
        mandatory: boolean;
        allow_guidance_override: boolean;
        force_required: boolean;
    };
}

interface QuestionBankCreateUpdateQuestion {
    required: number;
    allow_guidance_override: number;
    force_required: number;
    team_id?: number;
    user_id?: number;
    section_id: number;
    field: FormHydrationField;
    guidance: string;
    title: string;
}

interface QuestionBankVersion {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    version: number;
    question_json: string;
    required: number;
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
