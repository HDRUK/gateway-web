import { get, isEmpty, pick } from "lodash";
import { cookies } from "next/headers";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { getDataset } from "@/utils/api";
import ActionBar from "./components/ActionBar";
import { datasetFields } from "./config";

export const metadata = {
    title: "Health Data Research Innovation Gateway - Dataset",
    description: "",
};

const DATASET_STAT_PATHS = [
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

    console.log("datasetId - ", datasetId, DATASET_STAT_PATHS);

    const datasetVersion = data?.versions?.[0];
    console.log("datasetVersion - ", datasetVersion);

    const datasetStats = pick(datasetVersion, DATASET_STAT_PATHS);
    console.log("datasetStats - ", datasetStats);

    const populatedSections = datasetFields.filter(section =>
        section.fields.some(field => !isEmpty(get(datasetVersion, field.path)))
    );
    console.log("populatedSections - ", populatedSections);

    const activeLinkList = populatedSections.map(section => {
        return { label: section.sectionName };
    });

    return (
        <BoxContainer
            sx={{
                gridTemplateColumns: {
                    mobile: "repeat(1, 1fr)",
                    tablet: "repeat(5, 1fr)",
                },
            }}>
            <Box
                sx={{
                    gridColumn: { tablet: "span 2", laptop: "span 1" },
                    bgcolor: "white",
                    p: 0,
                }}>
                <ActiveListSidebar items={activeLinkList} />
            </Box>
            <Box
                sx={{
                    gridColumn: { tablet: "span 3", laptop: "span 4" },
                    p: 0,
                }}>
                <>
                    <ActionBar />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        {/* {datasetStats && (
                            <Box sx={{ p: 0, gap: 2 }}>
                                <Typography
                                    variant="h2"
                                    sx={{ pt: 0.5, pb: 0.5 }}>
                                    {
                                        datasetVersion.metadata.metadata.summary
                                            .title
                                    }
                                </Typography>
                                <div>
                                    <DatasetStats data={datasetStats} />
                                </div>
                            </Box>
                        )} */}
                        {/* <DatasetContent
                            data={datasetVersion}
                            populatedSections={populatedSections}
                        /> */}
                    </Box>
                </>
            </Box>
        </BoxContainer>
    );
}
