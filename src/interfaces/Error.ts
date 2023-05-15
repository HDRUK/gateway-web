interface Error {
    status: number;
    message: string;
    title: string;
    errors: { message: string }[];
}

export type { Error };
