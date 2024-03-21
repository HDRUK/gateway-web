import dayjs from "dayjs";

const getDayjs = (date: string | Date) => {
    return typeof date === "string" ? dayjs(new Date(date)) : dayjs(date);
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

export { formatDate, differenceInDays, getYear, yearToDayJsDate };
