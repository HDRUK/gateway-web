export interface EmailTemplate {
    id: number;
    identifier: string;
    subject: string;
    body: string;
    enabled: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface EmailTemplateFormValues {
    identifier: string;
    subject: string;
    body: string;
    enabled: boolean;
}
