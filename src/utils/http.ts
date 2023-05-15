import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
    responseType: "json",
});

axiosInstance.interceptors.request.use(reqConfig => {
    const req: InternalAxiosRequestConfig = {
        ...reqConfig,
    };
    req.withCredentials = true;

    return req;
});

export default axiosInstance;
