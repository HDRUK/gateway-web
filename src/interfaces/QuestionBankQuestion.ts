import { FormHydration } from "./FormHydration";

interface QuestionBankQuestion {
    id: number;
    created_at: string;
    user_name: string;
    version: number;
    question_json: FormHydration;
    locked: number;
    required: number;
    section_id: number;
}

export type { QuestionBankQuestion };
