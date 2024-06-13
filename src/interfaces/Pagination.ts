interface PaginationType<T> {
    lastPage: number;
    to: number;
    from: number;
    currentPage: number;
    total: number;
    list: T[];
}

export type { PaginationType };
