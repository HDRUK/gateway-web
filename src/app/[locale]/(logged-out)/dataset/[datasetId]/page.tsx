import { get, isEmpty, pick } from "lodash";
import { cookies } from "next/headers";
import { Dataset } from "@/interfaces/Dataset";
import Box from "@/components/Box";
import BoxContainer from "@/components/BoxContainer";
import LayoutDataItemPage from "@/components/LayoutDataItemPage";
import Typography from "@/components/Typography";
import ActiveListSidebar from "@/modules/ActiveListSidebar";
import { getDataset, getTeam } from "@/utils/api";
import { getLatestVersion } from "@/utils/dataset";
import ActionBar from "./components/ActionBar";
import DatasetContent from "./components/DatasetContent";
import DatasetMindMap from "./components/DatasetMindMap";
import DatasetStats from "./components/DatasetStats";
import GoogleRecommended from "./components/GoogleRecommended";
import Linkages from "./components/Linkages";
import Publications from "./components/Publications";
import Sources from "./components/Sources";
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

const SCHEMA_NAME = process.env.NEXT_PUBLIC_SCHEMA_NAME || "HDRUK";
const SCHEMA_VERSION = process.env.NEXT_PUBLIC_SCHEMA_VERSION || "3.0.0";

export default async function DatasetItemPage({
    params,
}: {
    params: { datasetId: string };
}) {
    const { datasetId } = params;

    const cookieStore = cookies();
    const data = await getDataset(
        cookieStore,
        datasetId,
        SCHEMA_NAME,
        SCHEMA_VERSION
    );
    const team = await getTeam(cookieStore, data.team_id.toString());

    let googleRecommendedDataset: Dataset | undefined;

    try {
        googleRecommendedDataset = await getDataset(
            cookieStore,
            datasetId,
            "SchemaOrg",
            "GoogleRecommended"
        );
    } catch (_e) {
        // Intentionally left empty
    }

    const datasetVersion = data?.versions?.[0];

    const datasetStats = pick(datasetVersion, DATASET_STAT_PATHS);

    const populatedSections = datasetFields.filter(section =>
        section.fields.some(field => !isEmpty(get(datasetVersion, field.path)))
    );

    const linkageCounts = {
        tools: data?.tools_count,
        publications: data?.publications_count,
        publications_about: data?.publications.filter(
            pub => pub.dataset_versions[0].link_type === "ABOUT"
        ).length,
        publications_using: data?.publications.filter(
            pub => pub.dataset_versions[0].link_type === "USING"
        ).length,
        durs: data?.durs_count,
        collections: data?.collections_count,
    };

    const activeLinkList = populatedSections.map(section => {
        return { label: section.sectionName };
    });

    return (
        <LayoutDataItemPage
            navigation={<ActiveListSidebar items={activeLinkList} />}
            body={
                <>
                    <ActionBar dataset={data} team={team} />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}>
                        {datasetStats && (
                            <Box sx={{ p: 0, gap: 2 }}>
                                <Typography
                                    variant="h2"
                                    sx={{ pt: 0.5, pb: 0.5 }}>
                                    {
                                        datasetVersion.metadata?.metadata
                                            ?.summary?.title
                                    }
                                </Typography>
                                <div>
                                    <DatasetStats data={datasetStats} />
                                </div>
                            </Box>
                        )}

                        <BoxContainer
                            sx={{
                                gridTemplateColumns: {
                                    tablet: "2fr 1fr",
                                },
                                gap: {
                                    mobile: 1,
                                    tablet: 2,
                                },
                                p: 0,
                            }}>
                            <Box
                                sx={{
                                    p: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}>
                                <DatasetMindMap
                                    data={datasetVersion}
                                    teamId={data?.team_id}
                                    populatedSections={populatedSections}
                                    linkageCounts={linkageCounts}
                                    hasStructuralMetadata={
                                        !!datasetVersion.metadata?.metadata
                                            ?.structuralMetadata?.length
                                    }
                                />

                                <DatasetContent
                                    data={datasetVersion}
                                    populatedSections={populatedSections}
                                />
                            </Box>
                            <Box
                                sx={{
                                    p: 0,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}>
                                <Sources
                                    data={datasetVersion.metadata.metadata}
                                />
                                <Linkages data={data} />

                                <Publications data={data} />
                            </Box>
                            <Box />
                        </BoxContainer>

                        {googleRecommendedDataset && (
                            <GoogleRecommended
                                metadata={getLatestVersion(
                                    googleRecommendedDataset
                                )}
                            />
                        )}
                    </Box>
                </>
            }
        />
    );
}
