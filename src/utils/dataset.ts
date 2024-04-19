import { isEmpty } from "lodash";
import { getYear } from "./date";

const LEAD_TIME_UNITS = ["WEEK", "WEEKS", "MONTH", "MONTHS"];
const UNDEFINED_VALUE = "undefined";
const NULL_VALUE = "null";

const parseLeadTime = (leadTimeString: string) => {
    if (!leadTimeString) {
        return [];
    }

    const matchedUnit = LEAD_TIME_UNITS.find(unit =>
        leadTimeString.endsWith(unit)
    );

    if (matchedUnit) {
        const time = leadTimeString
            .substring(0, leadTimeString.length - matchedUnit.length)
            .trim();
        return [time, matchedUnit];
    }

    return [leadTimeString];
};

const splitStringList = (inputString: string) => {
    try {
        return inputString
            .split(",")
            ?.map(item => item.replace(/;/g, "").trim());
    } catch (err) {
        return [inputString];
    }
};

const hasValidValue = (val: string | string[]) =>
    !isEmpty(val) && val !== UNDEFINED_VALUE && val !== NULL_VALUE;

const formatYearStat = (startYear?: string, endYear?: string) => {
    const hasStartYear = startYear && hasValidValue(startYear);
    const hasEndYear = endYear && hasValidValue(endYear);
    const dividerChar = hasStartYear && hasEndYear ? " - " : "";

    return `${hasStartYear ? getYear(startYear) : ""}${dividerChar}${
        hasEndYear ? getYear(endYear) : ""
    }`;
};

export { parseLeadTime, splitStringList, hasValidValue, formatYearStat };
