import useSWR, { KeyedMutator } from "swr";
import { Error } from "@/interfaces/Error";
import apiService from "@/services/api";

interface Response<T> {
    data: T | undefined;
    error: Error | undefined;
    isLoading: boolean;
    mutate: KeyedMutator<T>;
}

const useGet = <T>(key: string): Response<T> => {
    const { data, error, mutate } = useSWR<T>(key, apiService.getRequest);

    return {
        error,
        isLoading: !data && !error,
        data,
        mutate,
    };
};

export default useGet;
