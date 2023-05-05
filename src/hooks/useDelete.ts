import { MutatorOptions, useSWRConfig } from "swr";
import { deleteRequest } from "@/services/api/delete";
import useGet from "./useGet";

const useDelete = <T extends { id?: number }>(
    key: string,
    options?: MutatorOptions
) => {
    const { mutate } = useSWRConfig();
    const { data } = useGet(key);

    return (payload: T) => {
        mutate(
            key,
            async () => {
                await deleteRequest(`${key}/${payload.id}`);
                return Array.isArray(data)
                    ? data.map(item =>
                          item.id === payload.id ? payload : item
                      )
                    : payload;
            },
            {
                // data to immediately update the client cache
                optimisticData: Array.isArray(data)
                    ? data.map(item =>
                          item.id === payload.id ? payload : item
                      )
                    : payload,
                // rollback if the remote mutation errors
                rollbackOnError: true,
                ...options,
            }
        );
    };
};

export default useDelete;
