export interface QuestionBankSection {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    name: string;
    description: string | null;
    parent_section: number | null;
    order: number;
}
