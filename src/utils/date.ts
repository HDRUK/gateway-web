import { format } from "date-fns";
import differenceInDays from "date-fns/differenceInDays";

const formatDate = (date: Date, formatStr = "dd MMMM yyyy") => {
    return format(date, formatStr);
};

export { formatDate, differenceInDays };
