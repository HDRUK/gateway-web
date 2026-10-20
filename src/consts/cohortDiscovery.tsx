import { ChipProps } from "@mui/material/Chip";
import { RouteName } from "@/consts/routeName";

const COHORT_STATUS = {
    APPROVED: "APPROVED",
    RENEWING: "RENEWING",
    REJECTED: "REJECTED",
    PENDING: "PENDING",
    BANNED: "BANNED",
    SUSPENDED: "SUSPENDED",
    EXPIRED: "EXPIRED",
} as const;

const NHS_SDE_STATUS = {
    IN_PROCESS: "IN PROCESS",
    APPROVAL_REQUESTED: "APPROVAL REQUESTED",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    BANNED: "BANNED",
    SUSPENDED: "SUSPENDED",
    EXPIRED: "EXPIRED",
} as const;

const COHORT_REAPPLY_STATUSES: string[] = [
    COHORT_STATUS.REJECTED,
    COHORT_STATUS.EXPIRED,
];

const isAwaitingCohortDecision = (
    requestStatus: string | null,
    hasAccess: boolean
) =>
    !!requestStatus &&
    !hasAccess &&
    !COHORT_REAPPLY_STATUSES.includes(requestStatus);

const NHS_SDE_NEGATIVE_STATUSES: string[] = [
    NHS_SDE_STATUS.REJECTED,
    NHS_SDE_STATUS.EXPIRED,
    NHS_SDE_STATUS.BANNED,
    NHS_SDE_STATUS.SUSPENDED,
];

const NHS_SDE_FINAL_STATUSES: string[] = [
    NHS_SDE_STATUS.APPROVED,
    NHS_SDE_STATUS.REJECTED,
    NHS_SDE_STATUS.BANNED,
    NHS_SDE_STATUS.SUSPENDED,
];

const statusMapping: Record<string, ChipProps> = {
    [COHORT_STATUS.APPROVED]: { color: "secondary" },
    [COHORT_STATUS.RENEWING]: { color: "primary" },
    [COHORT_STATUS.REJECTED]: { color: "warning" },
    [COHORT_STATUS.PENDING]: { variant: "outlined" },
    [COHORT_STATUS.BANNED]: { color: "error" },
    [COHORT_STATUS.SUSPENDED]: { color: "needsAction" },
    [COHORT_STATUS.EXPIRED]: { color: "error" },
};

const NHSSDEStatusMapping: Record<string, ChipProps> = {
    [NHS_SDE_STATUS.IN_PROCESS]: { variant: "outlined" },
    [NHS_SDE_STATUS.APPROVAL_REQUESTED]: { color: "primary" },
    [NHS_SDE_STATUS.APPROVED]: { color: "secondary" },
    [NHS_SDE_STATUS.REJECTED]: { color: "warning" },
    [NHS_SDE_STATUS.BANNED]: { color: "error" },
    [NHS_SDE_STATUS.SUSPENDED]: { color: "needsAction" },
    [NHS_SDE_STATUS.EXPIRED]: { color: "default" },
};

const NHS_SDE_FILTER = "The NHS Research Secure Data Environment (SDE) Network";
const COHORT_DISCOVERY_EXPIRY_WARNING_DAYS = 166;
const COHORT_DISCOVERY_SDE_EXPIRY_WARNING_DAYS = 1770;
const COHORT_EXPIRY_WARNING_DAYS = 15;

const STEP_STATE = {
    COMPLETE: "complete",
    ACTIVE: "active",
    LOCKED: "locked",
    PENDING: "pending",
} as const;

const COHORT_ABOUT_HREF = `/${RouteName.ACCOUNT}/${RouteName.PROFILE}/${RouteName.COHORT_DISCOVERY_ABOUT}`;

export {
    statusMapping,
    NHSSDEStatusMapping,
    COHORT_STATUS,
    COHORT_REAPPLY_STATUSES,
    NHS_SDE_STATUS,
    NHS_SDE_NEGATIVE_STATUSES,
    NHS_SDE_FINAL_STATUSES,
    COHORT_DISCOVERY_EXPIRY_WARNING_DAYS,
    COHORT_DISCOVERY_SDE_EXPIRY_WARNING_DAYS,
    COHORT_EXPIRY_WARNING_DAYS,
    isAwaitingCohortDecision,
    NHS_SDE_FILTER,
    STEP_STATE,
    COHORT_ABOUT_HREF,
};
