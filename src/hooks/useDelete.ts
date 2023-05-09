import { MutatorOptions, useSWRConfig } from "swr";
import { deleteRequest } from "@/services/api/delete";
import useGet from "./useGet";

const useDelete = (key: string, options?: MutatorOptions) => {
    const { mutate } = useSWRConfig();
    const { data } = useGet(key);

    return (id: number) => {
        mutate(
            key,
            async () => {
                await deleteRequest(`${key}/${id}`);
                return Array.isArray(data)
                    ? data.filter(item => item.id !== id)
                    : {};
            },
            {
                // data to immediately update the client cache
                optimisticData: Array.isArray(data)
                    ? data.filter(item => item.id !== id)
                    : {},
                // rollback if the remote mutation errors
                rollbackOnError: true,
                ...options,
            }
        );
    };
};

export default useDelete;
