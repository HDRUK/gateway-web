import { regExpConfig } from './regex.config';

/**
 * [_buildUrl]
 *
 * @param  {urlType[string]}
 * @description Return full URL for either CMS or App
 */
const _buildUrl = urlType => {
    // 1. destructure window
    const {
        location: { href, origin },
    } = window;
    if (href && href.includes('appspot.com')) {
        return origin;
    }
    if (href && !href.includes('localhost') && !href.includes('.cloudshell.dev')) {
        const regArray = _getRegexURL(urlType, href);
        if (regArray) {
            const url = regArray[2];
            // add -api to the sub domain for API requests
            switch (urlType) {
                case 'cms':
                    return `https://${url}`;
                default:
                    return `https://api${url}`;
            }
        }
    } else {
        return 'http://localhost:3001';
    }
};

/**
 * [_getRegex]
 *
 * @param {urlType[string], href{[string]}}
 * @description Returns regex test based on url type
 */ const _getRegexURL = (urlType, href) => {
    switch (urlType) {
        case 'cms':
            return regExpConfig.cmsUrl.exec(href);
        default:
            return regExpConfig.httpUrl.exec(href);
    }
};

export const getWidgetAPI = () => {
    const { href } = window.location;
    let widgetAPIURL = 'https://dev-datause-widget.dev.hdruk.dev';
    if (href.includes('.www.')) {
        widgetAPIURL = 'https://datause-widget.healthdatagateway.org';
    }
    if (href.includes('.uat.')) {
        widgetAPIURL = 'https://uat-datause-widget.healthdatagateway.org';
    }
    if (href.includes('.preprod.')) {
        widgetAPIURL = 'https://preprod-datause-widget.preprod.hdruk.dev/';
    }
    return widgetAPIURL;
};

export const addCmsGatewayApiHostname = path => {
    const { hostname } = window.location;
    let webHostname = 'https://api.www.healthdatagateway.org';

    if (hostname.includes('uat.')) {
        webHostname = 'https://api.uat.healthdatagateway.org';
    } else if (hostname.includes('preprod.')) {
        webHostname = 'https://api.preprod.hdruk.dev';
    } else if (hostname.includes('dev.hdruk.dev')) {
        webHostname = 'https://api.dev.hdruk.dev';
    } else if (hostname.includes('.cloudshell.dev') || hostname.includes('localhost')) {
        webHostname = 'http://localhost:3001';
    }

    return `${webHostname}/${path}`;
};

export const addCmsGatewayHostname = path => {
    const { hostname } = window.location;
    let webHostname = 'https://web.www.healthdatagateway.org';

    if (hostname.includes('uat.')) {
        webHostname = 'https://web.uat.healthdatagateway.org';
    } else if (hostname.includes('preprod.')) {
        webHostname = 'https://web.preprod.hdruk.dev';
    } else if (hostname.includes('dev.hdruk.dev')) {
        webHostname = 'https://web.dev.hdruk.dev';
    } else if (hostname.includes('.cloudshell.dev')) {
        webHostname = `https://web.${hostname.replace('web.', '')}`;
    } else if (hostname.includes('localhost')) {
        webHostname = 'http://localhost:3000';
    }

    return `${webHostname}/${path}`;
};

export const baseURL = _buildUrl('http');
export const cmsURL = _buildUrl('cms');
export const apiPath = `api/${process.env.REACT_APP_API_VERSION || 'v1'}`;
export const apiURL = `${baseURL}/${apiPath}`;
export const apiV2URL = `${baseURL}/api/v2`;
