import { isArray, isEmpty, isPlainObject } from "lodash";

const NOT_REPORTED = -1;

/**
 * `false` and `0` are answers, not absences - "not accessible for free" and a
 * population of zero both have to render. `-1` is the schemas' own
 * "not reported" sentinel, so it does not.
 */
export const isEmptyValue = (value: unknown): boolean => {
    if (typeof value === "boolean") return false;
    if (typeof value === "number") return value === NOT_REPORTED;

    return (
        !value ||
        (isArray(value) && !value.length) ||
        (isPlainObject(value) && isEmpty(value))
    );
};
