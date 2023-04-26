import { MutatorOptions, useSWRConfig } from "swr";
import { postRequest } from "@/services/api";
import useGet from "./useGet";

const usePost = <T>(key: string, options?: MutatorOptions) => {
    const { mutate } = useSWRConfig();
    const { data } = useGet(key);

    return (payload: Omit<T, "id">) => {
        mutate(
            key,
            async () => {
                const id = await postRequest(key, payload);
                return Array.isArray(data)
                    ? [...data, { ...payload, id }]
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

export default usePost;
