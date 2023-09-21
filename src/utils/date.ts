import { format } from "date-fns";

const formatDate = (date: Date, formatStr = "dd MMMM yyyy") => {
    return format(date, formatStr);
};

export { formatDate };
