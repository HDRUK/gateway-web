import { pick } from "lodash";
import { cookies } from "next/headers";
import Box from "@/components/Box";
import Typography from "@/components/Typography";
import { getDataset } from "@/utils/api";
import ActionBar from "./components/ActionBar";
import DatasetContent from "./components/DatasetContent";
import DatasetStats from "./components/DatasetStats";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Dataset",
    description: "",
};

const STAT_PATHS = [
    "metadata.metadata.summary.populationSize",
    "metadata.metadata.provenance.temporal.startDate",
    "metadata.metadata.provenance.temporal.endDate",
    "metadata.metadata.coverage.biologicalsamples",
    "metadata.metadata.coverage.spatial",
    "metadata.metadata.accessibility.access.deliveryLeadTime",
];

export default async function DatasetItemPage({
    params,
}: {
    params: { datasetId: string };
}) {
    const { datasetId } = params;

    const cookieStore = cookies();
    const data = await getDataset(cookieStore, datasetId);

    const datasetVersion = data?.versions?.[0];
    const datasetStats = pick(datasetVersion, STAT_PATHS);

    return (
        <>
            <ActionBar />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ p: 0, gap: 2 }}>
                    <Typography variant="h2" sx={{ pt: 0.5, pb: 0.5 }}>
                        {datasetVersion.metadata.metadata.summary.title}
                    </Typography>
                    <DatasetStats data={datasetStats} />
                </Box>
                <DatasetContent data={datasetVersion} />
            </Box>
        </>
    );
}
