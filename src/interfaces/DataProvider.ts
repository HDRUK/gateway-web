export interface DataProvider {
    name: string;
    _id?: string;
    datasets_count?: number;
    publications_count?: number;
    tools_count?: number;
    collections_count?: number;
    durs_count?: number;
}
