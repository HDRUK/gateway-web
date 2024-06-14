import { get } from "lodash";
import { ReadonlyURLSearchParams } from "next/navigation";
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

const getPopulationSize = (
    metadata: Metadata | undefined,
    notReportedLabel: string
) => {
    if (!metadata) return notReportedLabel;

    const population = get(metadata, "summary.populationSize");
    return population && typeof population === "number" && population > 0
        ? (population as number).toLocaleString()
        : notReportedLabel;
};

const getAllParams = (searchParams: ReadonlyURLSearchParams | null) => {
    const params: { [key: string]: string } = {};

    Array.from(searchParams?.entries() || []).forEach(([key, value]) => {
        params[key] = value;
    });

    return params;
};

export { getDateRange, getPopulationSize, getAllParams };
