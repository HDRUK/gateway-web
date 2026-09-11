import { ValueType } from "./Autocomplete";

const getChipLabel = (
    options: { value: string | number; label: string }[],
    value: ValueType
) => {
    if (typeof value === "string") {
        return value;
    }

    return options.find(option => option.value === value)?.label;
};

const countTagsWithinRows = (offsetTops: number[], maxRows: number) => {
    const rows = [...new Set(offsetTops)];

    if (rows.length <= maxRows) {
        return offsetTops.length;
    }

    const lastVisibleRow = rows[maxRows - 1];
    const fitting = offsetTops.filter(top => top <= lastVisibleRow).length;

    return Math.max(fitting - 1, 1);
};

export { countTagsWithinRows, getChipLabel };
