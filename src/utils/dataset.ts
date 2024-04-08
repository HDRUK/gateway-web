const LEAD_TIME_UNITS = ["WEEK", "WEEKS", "MONTH", "MONTHS"];

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

const splitStringList = (inputString: string) =>
    inputString.split(",").map(item => item.replace(/;/g, "").trim());

export { parseLeadTime, splitStringList };
