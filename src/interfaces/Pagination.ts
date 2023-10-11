interface PaginationType<T> {
    lastPage: number;
    total: number;
    list: T[];
}

export type { PaginationType };
