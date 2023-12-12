import dayjs from "dayjs";

interface Status {
    APPROVED: boolean;
    REJECTED: boolean;
    PENDING: boolean;
    BANNED: boolean;
    SUSPENDED: boolean;
    EXPIRED: boolean;
}

interface CohortExportForm {
    organisations: string[];
    dateRangeFrom: dayjs.Dayjs;
    dateRangeTo: dayjs.Dayjs;
    status: Status;
}

interface CsvExport {
    content: string;
    type: string;
    filename: string;
}

export type { CohortExportForm, CsvExport };
