import { MutatorOptions, useSWRConfig } from "swr";
import { postRequest } from "@/services/api";

const usePostItem = <T>(
    key: string,
    items: T[] | undefined,
    options?: MutatorOptions
) => {
    const { mutate } = useSWRConfig();

    const createItem = (payload: Omit<T, "id">) => {
        mutate(
            key,
            async () => {
                const id = await postRequest(key, payload);
                return [...(items || []), { ...payload, id }];
            },
            {
                // data to immediately update the client cache
                optimisticData: [...(items || []), payload],
                // rollback if the remote mutation errors
                rollbackOnError: true,
                ...options,
            }
        );
    };

    return createItem;
};

export default usePostItem;
