const statusMapping = {
    APPROVED: "secondary",
    REJECTED: "warning",
    PENDING: "primary",
    BANNED: "error",
    SUSPENDED: "warningAmber",
    EXPIRED: "default",
};

const COHORT_DISCOVERY_EXPIRY_WARNING_DAYS = 166;

export { statusMapping, COHORT_DISCOVERY_EXPIRY_WARNING_DAYS };
