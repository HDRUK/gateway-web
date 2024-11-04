import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TIMEZONE = "UTC";

const getToday = (): string => {
    return dayjs.tz(new Date(), DEFAULT_TIMEZONE).format("YYYY-MM-DD HH:mm:ss");
};

const getDayjs = (date: string | Date) => {
    return typeof date === "string"
        ? dayjs.tz(new Date(date), DEFAULT_TIMEZONE)
        : dayjs.tz(date, DEFAULT_TIMEZONE);
};

const formatDate = (date: string | Date, formatStr = "DD MMM YYYY") => {
    const convertedDate1 = getDayjs(date);
    return convertedDate1.format(formatStr);
};

const differenceInDays = (date1: string | Date, date2: string | Date) => {
    const convertedDate1 = getDayjs(date1);
    const convertedDate2 = getDayjs(date2);

    return convertedDate1.diff(convertedDate2, "day");
};
const getYear = (date: string | Date) => {
    return getDayjs(date).year();
};

const yearToDayJsDate = (year: string) => {
    return dayjs(`${year}-01-01T00:00:00.000Z`);
};

export {
    formatDate,
    differenceInDays,
    getYear,
    yearToDayJsDate,
    getDayjs,
    getToday,
};
