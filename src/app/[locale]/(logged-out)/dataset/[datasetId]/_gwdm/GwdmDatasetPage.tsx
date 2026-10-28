import { JSONSchemaDocument } from "@hdruk/gwdm-view";
import { notFound } from "next/navigation";
import { DataStatus } from "@/consts/application";
import {
    GWDM_SCHEMA_NAME,
    SCHEMA_NAME,
    SCHEMA_VERSION,
} from "@/consts/schema";
import { getDataset, getSchemaFromTraser } from "@/utils/api";
import DatasetPageShell from "./components/DatasetPageShell";
import { DuoCodeDetails, toDuoCodeDetails } from "./lib/duoCodeDetails";

/**
 * The dataset page rendered from native GWDM, behind the GwdmDatasetPage flag
 * (see ../page.tsx). GWDM is requested explicitly - without that the API
 * applies the caller's partner default output schema, which external partners
 * rely on - and the response reports the GWDM version in `schema`. The
 * matching JSON Schema comes from TRASER and supplies the labels and tooltips
 * the generic renderer uses.
 *
 * A plain async function rather than a nested async component so the route
 * can return its result directly.
 */
export default async function GwdmDatasetPage({
    datasetId,
}: {
    datasetId: string;
}) {
    const [dataset, googleRecommended, duoSchema] = await Promise.all([
        getDataset(datasetId, GWDM_SCHEMA_NAME, undefined, {
            suppressError: true,
        }),
        // JSON-LD for search engines only - not what the page renders.
        getDataset(datasetId, "SchemaOrg", "GoogleRecommended").catch(
            () => undefined
        ),
        // DUO code labels live in the HDRUK schema, not GWDM - fetched the
        // same way the existing dataset page fetches them.
        getSchemaFromTraser(SCHEMA_NAME, SCHEMA_VERSION).catch(() => undefined),
    ]);

    if (!dataset || dataset.status !== DataStatus.ACTIVE) notFound();

    const gwdmVersion =
        dataset.schema?.version ??
        dataset.versions?.[0]?.metadata?.gwdmVersion ??
        dataset.versions?.[0]?.gwdm_version;

    // Without a schema the chrome still renders; the shell explains that the
    // detailed metadata is unavailable.
    const schema = gwdmVersion
        ? await getSchemaFromTraser(GWDM_SCHEMA_NAME, gwdmVersion)
              .then(
                  response => response?.schema as unknown as JSONSchemaDocument
              )
              .catch(() => undefined)
        : undefined;

    const duoCodeDetails: Record<string, DuoCodeDetails> =
        toDuoCodeDetails(duoSchema);

    return (
        <DatasetPageShell
            dataset={dataset}
            schema={schema}
            googleRecommended={googleRecommended}
            duoCodeDetails={duoCodeDetails}
        />
    );
}
