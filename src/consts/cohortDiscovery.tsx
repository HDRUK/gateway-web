const statusMapping = {
    APPROVED: "secondary",
    REJECTED: "warning",
    PENDING: "primary",
    BANNED: "error",
    SUSPENDED: "warningCustom",
    EXPIRED: "default",
};

const NHSSDEStatusMapping = {
    IN_PROCESS: "yellowCustom",
    APPROVAL_REQUESTED: "primary",
    APPROVED: "secondary",
    REJECTED: "warning",
    BANNED: "error",
    SUSPENDED: "warningCustom",
    EXPIRED: "default",
};

const COHORT_DISCOVERY_EXPIRY_WARNING_DAYS = 166;
const COHORT_DISCOVERY_SDE_EXPIRY_WARNING_DAYS = 1770;

export {
    statusMapping,
    NHSSDEStatusMapping,
    COHORT_DISCOVERY_EXPIRY_WARNING_DAYS,
    COHORT_DISCOVERY_SDE_EXPIRY_WARNING_DAYS,
};
