const toTitleCase = (value: string) => {
    return value.replace(/\w\S*/g, (data: string) => {
        return data.charAt(0).toUpperCase() + data.substr(1).toLowerCase();
    });
};

const getLastSplitPart = (input: string, delimiter: string): string => {
    const parts = input.split(delimiter);
    return parts[parts.length - 1];
};

const convertNumericalCharaterEntities = (value: string) =>
    value.replace(/&#(\d+);/g, function (_, n) {
        return String.fromCharCode(n);
    });

export { toTitleCase, getLastSplitPart, convertNumericalCharaterEntities };
