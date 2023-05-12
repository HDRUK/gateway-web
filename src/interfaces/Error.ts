interface Error {
    code: number;
    status: string;
    message: string;
    title: string;
    errors: string[];
}

export type { Error };
