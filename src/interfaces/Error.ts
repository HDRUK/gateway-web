interface Error {
    status?: string; // not currently used in FE
    message?: string;
    errors?: { message: string }[];
}

export type { Error };
