import { AxiosRequestConfig } from "axios";
import http from "@/utils/http";

type DeleteResponse = {
    message: string;
};

const deleteRequest = async (
    url: string,
    options?: AxiosRequestConfig
): Promise<DeleteResponse> => {
    return await http.delete(url, options).then(res => res.data);
};

export { deleteRequest };
