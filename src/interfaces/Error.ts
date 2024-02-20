interface Error {
    status: string;
    message: string;
    errors: { message: string }[];
}

export type { Error };
