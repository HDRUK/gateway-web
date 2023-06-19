import { HttpOptions, PaginationResponse } from "@/interfaces/Api";

interface FnProps {
    options: HttpOptions | undefined;
    data: unknown;
    id: string | number;
    payload: {
        [key: string]: unknown;
    };
}

const deleteOptimisticData = ({
    options = {},
    data,
    id,
}: Pick<FnProps, "options" | "data" | "id">) => {
    if (options?.withPagination) {
        return {
            list: (data as PaginationResponse)?.list.filter(
                item => item.id !== id
            ),
            lastPage: (data as PaginationResponse)?.lastPage,
        };
    }

    return Array.isArray(data) ? data.filter(item => item.id !== id) : {};
};

const deleteMutateData = ({
    options = {},
    data,
    id,
}: Pick<FnProps, "options" | "data" | "id">) => {
    return deleteOptimisticData({ options, data, id });
};

const postOptimisticData = ({
    options = {},
    data,
    payload,
}: Pick<FnProps, "options" | "data" | "payload">) => {
    if (options?.withPagination) {
        return {
            list: (data as PaginationResponse)?.list || [],
            lastPage: (data as PaginationResponse)?.lastPage,
        };
    }
    return Array.isArray(data) ? [...data, { ...payload }] : { ...payload };
};

const postMutateData = ({ options = {}, data, payload, id }: FnProps) => {
    if (options?.withPagination) {
        return {
            list: (data as PaginationResponse)?.list || [],
            lastPage: (data as PaginationResponse)?.lastPage,
        };
    }

    return Array.isArray(data)
        ? [...data, { ...payload, id }]
        : { ...payload, id };
};

const putOptimisticData = ({
    options = {},
    data,
    payload,
}: Pick<FnProps, "options" | "data" | "payload">) => {
    if (options?.withPagination) {
        return {
            list: (data as PaginationResponse)?.list.map(item =>
                item.id === payload.id ? payload : item
            ),
            lastPage: (data as PaginationResponse)?.lastPage,
        };
    }

    return Array.isArray(data)
        ? data.map(item => (item.id === payload.id ? payload : item))
        : payload;
};

const putMutateData = ({
    options = {},
    data,
    payload,
}: Pick<FnProps, "options" | "data" | "payload">) => {
    return putOptimisticData({ options, data, payload });
};

const ThrowPaginationError = (options: HttpOptions | undefined) => {
    if (
        (options?.withPagination && !options?.paginationKey) ||
        (options?.paginationKey && !options?.withPagination)
    ) {
        throw Error(
            "You must provide both paginationKey and withPagination=true"
        );
    }
};

export {
    deleteOptimisticData,
    deleteMutateData,
    ThrowPaginationError,
    postOptimisticData,
    postMutateData,
    putOptimisticData,
    putMutateData,
};
