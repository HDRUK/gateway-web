import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const getTZDate = (date: string | Date, timezone?: string) => {
    if (!timezone) {
        return dayjs(date).utc();
    }

    return dayjs(date).tz(timezone);
};

const getToday = (): string => {
    return getTZDate(new Date()).format("YYYY-MM-DDTHH:mm:ss[Z]");
};

const getDayjs = (date: string | Date) => {
    return date ? getTZDate(date) : null;
};

const formatDate = (date: string | Date, formatStr = "DD MMM YYYY") => {
    const convertedDate1 = getDayjs(date);
    return convertedDate1?.format(formatStr);
};

const differenceInDays = (date1: string | Date, date2: string | Date) => {
    const convertedDate1 = getDayjs(date1);
    const convertedDate2 = getDayjs(date2);

    return convertedDate1?.diff(convertedDate2, "day");
};
const getYear = (date: string | Date) => {
    return getDayjs(date)?.year();
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
    getTZDate,
};
