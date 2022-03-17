const thisBaseURL = window.location.toString();

module.exports = {
    getURL() {
        if (thisBaseURL.includes('appspot.com')) {
            return window.location.origin;
        }
        if (!thisBaseURL.includes('localhost')) {
            const rx = /^([http|https]+:\/\/[a-z]+)([^/]*)/;
            const arr = rx.exec(thisBaseURL);
            if (arr && arr.length > 0) {
                // add -api to the sub domain for API requests
                return `https://api${arr[2]}`;
            }
            return 'http://localhost:3001';
        }
        return 'http://localhost:3001';
    },

    getCMSURL() {
        if (thisBaseURL.includes('appspot.com')) {
            return window.location.origin;
        }
        if (!thisBaseURL.includes('localhost')) {
            const rx = /^([http|https]+:\/\/[a-z]+)\.([^/]*)/;
            const arr = rx.exec(thisBaseURL);
            if (arr && arr.length > 0) {
                // add -api to the sub domain for API requests
                return `https://${arr[2]}`;
            }

            return 'http://localhost:3001';
        }
        return 'http://localhost:3001';
    },

    getURLEnv() {
        if (thisBaseURL.includes('localhost')) {
            return 'local';
        }

        const rx = /^([http|https]+:\/\/[a-z]+)\.([^.]*)/;
        const url = rx.exec(thisBaseURL);

        if (url) {
            if (url.length <= 0) {
                return 'local';
            }

            const env = url[2];
            if (env === 'www') {
                return 'prod';
            }
            return env;
        }
    },
    getDiscourseURL() {
        return window.location.href.includes('.www.')
            ? 'https://discourse.healthdatagateway.org'
            : 'https://discourse-dev.healthresearch.tools';
    },
};
