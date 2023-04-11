import axios, { AxiosRequestConfig } from "axios";

const getRequest = async <T>(
    url: string,
    options?: AxiosRequestConfig
): Promise<T> => {
    return await axios.get(url, options).then(res => res.data);
};

export { getRequest };
