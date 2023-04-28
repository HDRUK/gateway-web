import { MutatorOptions, useSWRConfig } from "swr";
import { putRequest } from "@/services/api";
import useGet from "./useGet";

const usePut = <T>(key: string, options?: MutatorOptions) => {
    const { mutate } = useSWRConfig();
    const { data } = useGet(key);

    return (payload: any) => {
        mutate(
            key,
            async () => {
                const id = await putRequest(`${key}/${payload.id}`, payload);
                return Array.isArray(data)
                    ? data.map(item =>
                          item.id === payload.id ? payload : item
                      )
                    : { ...payload, id };
            },
            {
                // data to immediately update the client cache
                optimisticData: Array.isArray(data)
                    ? [...data, payload]
                    : payload,
                // rollback if the remote mutation errors
                rollbackOnError: true,
                ...options,
            }
        );
    };
};

export default usePut;
