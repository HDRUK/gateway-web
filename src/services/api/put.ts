import { AxiosRequestConfig } from "axios";
import http from "@/utils/http";

const putRequest = async <T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig
): Promise<T> => {
    //  to be replaced with PUT as part of GAT-2244
    return await http.patch(url, data, options).then(res => res.data?.data);
};

export { putRequest };
