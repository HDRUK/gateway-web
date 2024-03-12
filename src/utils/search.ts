import { get } from "lodash";
import { Metadata } from "@/interfaces/Dataset";
import { formatDate } from "./date";

const getDateRange = (metadata: Metadata) => {
    const endDate = get(metadata, "provenance.temporal.endDate");
    const startDate = get(metadata, "provenance.temporal.startDate");
    if (!endDate && !startDate) return "n/a";
    return `${startDate ? formatDate(startDate, "YYYY") : ""}-${
        endDate ? formatDate(endDate, "YYYY") : ""
    }`;
};

const getPopulationSize = (metadata: Metadata, notReportedLabel: string) => {
    const population = get(metadata, "observations.0.measuredValue");
    return population
        ? (population as number).toLocaleString()
        : notReportedLabel;
};

export { getDateRange, getPopulationSize };
