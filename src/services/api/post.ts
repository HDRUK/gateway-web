import { AxiosRequestConfig } from "axios";
import http from "@/utils/http";

const postRequest = async <T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig
): Promise<T> => {
    return await http.post(url, data, options).then(res => res.data?.data);
};

export { postRequest };
