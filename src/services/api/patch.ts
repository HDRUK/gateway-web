import { AxiosRequestConfig } from "axios";
import http from "@/utils/http";

const patchRequest = async <T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig
): Promise<T> => {
    return await http.patch(url, data, options).then(res => res.data?.data);
};

export { patchRequest };
