interface QuestionBankQuestion {
    id: number;
    created_at: string;
    user_name: string;
    version: number;
    question_json: string;
    locked: number;
    required: number;
    section_id: number;
}

export type { QuestionBankQuestion };
