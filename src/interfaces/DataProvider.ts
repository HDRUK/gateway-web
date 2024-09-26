export interface DataProvider {
    name: string;
    id?: string;
    introduction: string | null;
    datasets_count?: number;
    publications_count?: number;
    tools_count?: number;
    collections_count?: number;
    durs_count?: number;
    url: string | null;
}
