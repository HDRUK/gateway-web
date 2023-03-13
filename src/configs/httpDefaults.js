import axios from 'axios';
import * as Sentry from '@sentry/react';

export default () => {
    axios.defaults.withCredentials = true;
    axios.defaults.timeout = 60000;
    axios.interceptors.response.use(
        response => response,
        error => {
            // allow 404 errors to be handled by frontend logic
            if (error.response && error.response.status === 404) {
                return Promise.reject(error);
            }

            // catch all and report any other error type to Sentry
            console.error(error);
            Sentry.captureException(error);
            return Promise.reject(error);
        }
    );
};
