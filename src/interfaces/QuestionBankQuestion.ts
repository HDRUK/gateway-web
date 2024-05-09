import { FormHydration } from "./FormHydration";

interface QuestionBankQuestion {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    version: number;
    question_json: FormHydration;
    locked: number;
    required: number;
    section_id: number;
    user_id: number;
    team_id: number;
}

export type { QuestionBankQuestion };
