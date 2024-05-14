export interface QuestionBankSection {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    name: string;
    sub_section: string | null;
    order: number;
}
