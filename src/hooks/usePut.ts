import { MutatorOptions, useSWRConfig } from "swr";
import { putRequest } from "@/services/api/put";
import useGet from "./useGet";

const usePut = <T extends { id?: number }>(
    key: string,
    options?: MutatorOptions
) => {
    const { mutate } = useSWRConfig();
    const { data } = useGet(key);

    return (payload: T) => {
        mutate(
            key,
            async () => {
                const id = await putRequest(`${key}/${payload.id}`, payload);
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

export default usePut;
