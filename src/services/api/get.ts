import { AxiosRequestConfig } from "axios";
import { http } from "@/utils";

const getRequest = async <T>(
    url: string,
    options?: AxiosRequestConfig
): Promise<T> => {
    return await http.get(url, options).then(res => res.data?.data);
};

export { getRequest };
