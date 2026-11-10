"use client";

import { useTranslations } from "next-intl";
import { renderObservationsTable } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/components/DatasetContent/DatasetContent";
import { Observation } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/config";

/** The production observations table, column headers and tooltips included. */
const ObservationsTable = ({ rows }: { rows: Observation[] }) => {
    const t = useTranslations("common");
    return renderObservationsTable(t("notReported"), rows);
};

export default ObservationsTable;
