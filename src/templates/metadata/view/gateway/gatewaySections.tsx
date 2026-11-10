import { ReactNode } from "react";
import { Demographics, StructuralMetadata } from "@/interfaces/Dataset";
import { Observation } from "@/app/[locale]/(logged-out)/dataset/[datasetId]/config";
import ObservationsTable from "./ObservationsTable";
import OpenTableButton from "./OpenTableButton";

/**
 * GWDM sections the production page renders specially rather than as rows.
 * Applied by <DatasetSection> for every template, under the section's own
 * schema heading and anchor; a template can still pass its own child instead.
 */
export const GATEWAY_SECTIONS: Record<string, (value: unknown) => ReactNode> = {
    observations: value => <ObservationsTable rows={value as Observation[]} />,
    demographicFrequency: value => (
        <OpenTableButton kind="demographics" data={value as Demographics} />
    ),
    structuralMetadata: value => (
        <OpenTableButton
            kind="structuralMetadata"
            data={value as StructuralMetadata[]}
        />
    ),
};
