import { format } from "date-fns";

const formatDate = (dateStr: Date, formatStr = "dd MMMM yyyy") => {
    return format(dateStr, formatStr);
};

export { formatDate };
