const CUSTOMER_PORTAL_SUPPORT_URL =
    process.env.CUSTOMER_PORTAL_SUPPORT_URL ||
    "https://hdruk.atlassian.net/servicedesk/customer/portal/1/group/1/create/1";
const GATEWAY_TERMS_URL =
    process.env.GATEWAY_TERMS_URL ||
    "https://www.healthdatagateway.org/about/terms-and-conditions";

export { CUSTOMER_PORTAL_SUPPORT_URL, GATEWAY_TERMS_URL };
