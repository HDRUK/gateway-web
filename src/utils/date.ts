import dayjs from "dayjs";

const getDayjs = (date: string | Date) => {
    return typeof date === "string" ? dayjs(new Date(date)) : dayjs(date);
};

const formatDate = (date: string | Date, formatStr = "DD MMMM YYYY") => {
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

export { formatDate, differenceInDays, getYear };
