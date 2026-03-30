const statusMapping = {
    APPROVED: "secondary",
    REJECTED: "warning",
    PENDING: "greyCustom",
    BANNED: "error",
    SUSPENDED: "warningCustom",
    EXPIRED: "error",
};

const NHSSDEStatusMapping = {
    "IN PROCESS": "greyCustom",
    "APPROVAL REQUESTED": "primary",
    APPROVED: "secondary",
    REJECTED: "warning",
    BANNED: "error",
    SUSPENDED: "warningCustom",
    EXPIRED: "default",
};

const NHS_SDE_FILTER = "The NHS Research Secure Data Environment (SDE) Network";
const COHORT_DISCOVERY_EXPIRY_WARNING_DAYS = 166;
const COHORT_DISCOVERY_SDE_EXPIRY_WARNING_DAYS = 1770;

export {
    statusMapping,
    NHSSDEStatusMapping,
    COHORT_DISCOVERY_EXPIRY_WARNING_DAYS,
    COHORT_DISCOVERY_SDE_EXPIRY_WARNING_DAYS,
    NHS_SDE_FILTER,
};
