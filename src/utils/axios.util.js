import axios from 'axios';

import { baseURL, cmsURL } from '../configs/url.config';

axios.defaults.withCredentials = true;

// Instantiate single Axios instance configuration for Innovation Gateway backend
export const axiosIG = axios.create({
    baseURL: baseURL,
    withCredentials: true
});

// Instantiate single Axios instance configuration for CMS
export const axiosCMS = axios.create({
    baseURL: cmsURL,
    withCredentials: true
});


