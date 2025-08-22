import dayjs from "dayjs";

interface Status {
    APPROVED: boolean;
    REJECTED: boolean;
    PENDING: boolean;
    BANNED: boolean;
    SUSPENDED: boolean;
    EXPIRED: boolean;
}

interface SdeStatus {
    NULL: boolean;
    "IN PROCESS": boolean;
    "APPROVAL REQUESTED": boolean;
    APPROVED: boolean;
    REJECTED: boolean;
    BANNED: boolean;
    SUSPENDED: boolean;
    EXPIRED: boolean;
}

interface CohortExportForm {
    organisations: string[];
    dateRangeFrom: dayjs.Dayjs;
    dateRangeTo: dayjs.Dayjs;
    status: Status;
    sdeStatus: SdeStatus;
}

export type { CohortExportForm };
