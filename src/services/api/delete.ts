import { AxiosRequestConfig } from "axios";
import http from "@/utils/http";

const deleteRequest = async <T>(
    url: string,
    options?: AxiosRequestConfig
): Promise<T> => {
    return await http.delete(url, options).then(res => res.data?.data);
};

export { deleteRequest };
