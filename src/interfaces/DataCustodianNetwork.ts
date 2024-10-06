export interface DataCustodianNetwork {
    name: string;
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    enabled: boolean;
    img_url: string | null;
    summary: string | null;
    url: string | null;
    service: string[] | null;
}
