import { isEmpty } from "lodash";
import { Dataset, VersionItem } from "@/interfaces/Dataset";
import Link from "@/components/Link";
import Typography from "@/components/Typography";
import { getYear } from "./date";

const LEAD_TIME_UNITS = ["WEEK", "WEEKS", "MONTH", "MONTHS"];
const UNDEFINED_VALUE = "undefined";
const NULL_VALUE = "null";
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

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

const getLatestVersion = (dataset: Dataset) => {
    return dataset?.latest_metadata || dataset?.versions?.[0];
};

const getLatestVersions = (dataset_versions: VersionItem[]): VersionItem[] => {
    // Given an array of VersionItems, return only the entries which are the latest version of their respective datasets
    const groupedByDatasetID = dataset_versions.reduce<VersionItem[]>(
        (r, o) => {
            const s = r;
            s[o.dataset_id] =
                s[o.dataset_id] && s[o.dataset_id].version > o.version
                    ? s[o.dataset_id]
                    : o;

            return r;
        },
        []
    );
    return Object.values(groupedByDatasetID);
};

const formatTextWithLinks = (text: string) => {
    return text.split(URL_REGEX).map(segment =>
        URL_REGEX.test(segment) ? (
            <Link href={segment} key={segment} target="_blank" rel="noopener">
                {segment}
            </Link>
        ) : (
            <Typography component="span" key={segment}>
                {segment}
            </Typography>
        )
    );
};

const formatTextDelimiter = (text: string) => {
    return text.replaceAll(";,;", ", ");
};

export {
    formatYearStat,
    getLatestVersion,
    getLatestVersions,
    hasValidValue,
    parseLeadTime,
    splitStringList,
    formatTextWithLinks,
    formatTextDelimiter,
};
