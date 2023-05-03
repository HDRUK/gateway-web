import { AxiosRequestConfig } from "axios";
import http from "@/utils/http";

const putRequest = async <T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig
): Promise<T> => {
    // update to `rest.put` as part of ticket GAT-2244
    return await http.put(url, data, options).then(res => res.data?.data);
};

export { putRequest };
